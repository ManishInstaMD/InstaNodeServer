// file: controllers/videoController.js
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

const processedDir = path.join(__dirname, "../processed");
fs.mkdirSync(processedDir, { recursive: true });
fs.chmodSync(processedDir, 0o777);

function wrapText(text, maxLength = 30) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxLength) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines.join("\\n");
}

function escapeText(text) {
  return `'${text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/\n/g, "\\n")
    .replace(/'/g, "\\'")}'`;
}

async function processVideoWithBackground(videoPath, backgroundPath, outputPath, textData = {}) {
  return new Promise((resolve, reject) => {
    const { doctorName = "", degree = "", mobile = "", address = "" } = textData;

    const wrappedDoctorName = wrapText(`Doctor:${doctorName}\n`);
    const wrappedDegree = wrapText(`Degree:${degree} \n`);
    const wrappedMobile = wrapText(`Mobile: ${mobile}  \n`);
    const wrappedAddress = wrapText(`Address: ${address} \n`);

    const textBlock = escapeText(`${wrappedDoctorName} ${wrappedMobile} ${wrappedAddress} ${wrappedDegree}`);

    ffmpeg()
      .input(backgroundPath)
      .input(videoPath)
      .complexFilter([
        "[0:v]scale=960:720[bg]",
        "[1:v]scale=-1:720[vid]",
        "[bg][vid]overlay=x=(W-w)/2:y=0[tmp]",
        {
          filter: "drawtext",
          options: {
            fontfile: "C\\:/Windows/Fonts/arial.ttf",
            text: textBlock,
            fontsize: 20,
            fontcolor: "white",
            box: 1,
            boxcolor: "black@0.9",
            boxborderw: 30,
            x: 50,
            y: "h-text_h",
            line_spacing: 10,
            fix_bounds: 1,
          },
          inputs: "tmp",
          outputs: "final",
        },
      ])
      .outputOptions(["-map", "[final]", "-map", "1:a?", "-c:a", "copy", "-y"])
      .output(outputPath)
      .on("start", (cmd) => console.log("FFmpeg command:", cmd))
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });
}

exports.handleUpload = async (req, res, err) => {
  try {
    if (err) return res.status(400).send({ error: err.message });
    if (!req.files || !req.files.video) return res.status(400).send({ error: "No video file uploaded" });

    const { doctorName, degree, mobile, address } = req.body;
    if (!doctorName || !degree || !mobile || !address) {
      if (req.files.video) fs.unlinkSync(req.files.video[0].path);
      if (req.files.background) fs.unlinkSync(req.files.background[0].path);
      return res.status(400).send({ error: "All fields are required" });
    }

    const videoPath = req.files.video[0].path;
    const backgroundPath = req.files.background ? req.files.background[0].path : null;
    const safeFilename = `output_${Date.now()}.mp4`;
    const outputPath = path.join(processedDir, safeFilename);

    await processVideoWithBackground(videoPath, backgroundPath, outputPath, {
      doctorName,
      degree,
      mobile,
      address,
    });

    if (req.files.background) fs.unlinkSync(req.files.background[0].path);
    fs.unlinkSync(videoPath);

    res.status(200).send({
      message: "Video processed successfully",
      file: safeFilename,
      downloadUrl: `/processed/${safeFilename}`,
    });
  } catch (error) {
    console.error("Processing error:", error);
    if (req.files?.video) fs.unlinkSync(req.files.video[0].path);
    if (req.files?.background) fs.unlinkSync(req.files.background[0].path);
    res.status(500).send({ error: error.message });
  }
};

//for production change