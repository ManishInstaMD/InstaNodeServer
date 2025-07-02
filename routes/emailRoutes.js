const express = require("express");
const router = express.Router(); // You missed this line
const sendInviteEmail = require("../utils/mail2");
const db = require("../config/database");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const csv = require("fast-csv");

router.post("/send-invite", async (req, res) => {
  const { toEmail, doctorName } = req.body;

  if (!toEmail || !doctorName) {
    return res
      .status(400)
      .json({ message: "toEmail and doctorName are required" });
  }

  try {
    await sendInviteEmail(toEmail, doctorName);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
});

// GET /api/users
router.get("/alkenUser", async (req, res) => {
  try {
    const users = await db.models.Alkem.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await db.models.Alkem.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("file"), async (req, res) => {
   const inputPath = req.file.path;
  const outputDir = path.join(__dirname, "uploads");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // ✅ Create if not exists
  }

  const outputPath = path.join(outputDir, `deduplicated-${Date.now()}.csv`);
  const seen = new Set();
  const rows = [];

  fs.createReadStream(inputPath)
  .pipe(
    csv.parse({
      headers: (headers) =>
        headers.map((h) => h.toLowerCase().replace(/\s+/g, "_")), // 👈 Normalize headers
    })
  )
  .on("data", (row) => {
    if (!seen.has(row.user_id)) {
      seen.add(row.user_id);
      rows.push(row);
    }
  })
    .on("end", () => {
      csv.writeToPath(outputPath, rows, { headers: true }).on("finish", () => {
        // Optional: delete original uploaded file
        fs.unlinkSync(inputPath);

        res.download(outputPath, (err) => {
          if (err) {
            console.error("Download error:", err);
            res.status(500).send("Error downloading file");
          } else {
            // Delete output file after download
            fs.unlinkSync(outputPath);
          }
        });
      });
    })
    .on("error", (err) => {
      res
        .status(500)
        .json({ message: "Failed to process CSV", error: err.message });
    });
});

module.exports = router;
