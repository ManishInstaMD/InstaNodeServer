// controllers/videoController.js
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);
const https = require("https");
const http = require("http");

const processedDir = path.join(__dirname, "../processed");
fs.mkdirSync(processedDir, { recursive: true });
fs.chmodSync(processedDir, 0o777);
async function downloadFile(url, directory) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(new URL(url).pathname);
    const filePath = path.join(directory, filename);
    const fileStream = fs.createWriteStream(filePath);

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
        return;
      }

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(filePath); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function wrapText(text, maxLength = 50) {
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
  return lines.join("\n");
}

function escapeText(text) {
  return `'${text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")}'`;
}

async function processVideoWithBackground(videoPath, backgroundPath, outputPath, textData = {}) {
  return new Promise((resolve, reject) => {
    const { doctorName = "", degree = "", mobile = "", address = "" } = textData;

    const wrappedDoctorName = wrapText(`Doctor: ${doctorName}`);
    const wrappedMobile = wrapText(`Mobile: ${mobile}`);
    const wrappedAddress = wrapText(`Address: ${address}`);
    const wrappedDegree = wrapText(`Degree: ${degree}`);

    const textBlock = escapeText(`${wrappedDoctorName}\n${wrappedMobile}\n${wrappedAddress}\n${wrappedDegree}`);

    ffmpeg()
      .input(backgroundPath)
      .input(videoPath)
      .complexFilter([
        "[0:v]scale=960:720[bg]",
        "[1:v]scale=-1:720[vid]",
        "[bg][vid]overlay=x=(W-w)/2:y=0[tmp]",
        {
          filter: "drawbox",
          options: {
            x: 0,
            y: "h-(h-1000)/2",
            width: "iw",
            height: 170,
            color: "black@1.0",
            t: "fill",
          },
          inputs: "tmp",
          outputs: "boxed",
        },
        {
          filter: "drawtext",
          options: {
            fontfile: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            text: textBlock,
            fontsize: 24,
            fontcolor: "white",
            box: 0,
            x: "(w-text_w)/2",
            y: "h-90",
            line_spacing: 10,
            fix_bounds: 1,
          },
          inputs: "boxed",
          outputs: "final",
        },
      ])
      .outputOptions(["-map", "[final]", "-map", "1:a?", "-c:a", "copy", "-y"])
      .output(outputPath)
      .on("start", (cmd) => console.log("Processing started:", cmd))
      .on("end", () => {
        console.log("Successfully processed:", outputPath);
        resolve();
      })
      .on("error", (err) => {
        console.error("Processing failed:", err);
        reject(err);
      })
      .run();
  });
}

exports.uploadHandler = async (req, res) => {
  try {
    const { 
      doctorName, 
      degree, 
      mobile, 
      address,
      videoUrl, 
      backgroundUrl 
    } = req.query;

    // Validate required parameters
    if (!doctorName || !degree || !mobile || !address || !videoUrl) {
      return res.status(400).json({ 
        error: "Missing required parameters: doctorName, degree, mobile, address, videoUrl" 
      });
    }

    // Download files
    const videoPath = await downloadFile(videoUrl, processedDir);
    const backgroundPath = backgroundUrl 
      ? await downloadFile(backgroundUrl, processedDir) 
      : null;

    const safeFilename = `output_${Date.now()}.mp4`;
    const outputPath = path.join(processedDir, safeFilename);

    await processVideoWithBackground(videoPath, backgroundPath, outputPath, {
      doctorName,
      degree,
      mobile,
      address,
    });

    // Cleanup downloaded files
    if (videoPath) fs.unlinkSync(videoPath);
    if (backgroundPath) fs.unlinkSync(backgroundPath);

    res.status(200).json({
      message: "Video processed successfully",
      file: safeFilename,
      downloadUrl: `/processed/${safeFilename}`,
    });

  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error" 
    });
  }
};

// Helper function to download files from URLs
// async function downloadFile(url, directory) {
//   const filename = path.basename(url);
//   const filePath = path.join(directory, filename);
  
  // const response = await fetch(url);
  // const fileStream = fs.createWriteStream(filePath);
  
//   return new Promise((resolve, reject) => {
//     response.body.pipe(fileStream);
//     response.body.on("error", reject);
//     fileStream.on("finish", () => resolve(filePath));
//   });
// }