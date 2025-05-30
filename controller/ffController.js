// controllers/videoController.js
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);
const https = require("https");
const http = require("http");
const axios = require("axios");

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

function wrapText(text, maxLength = 40, padExtra = false) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLength) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      lines.push(centerLine(currentLine, maxLength, padExtra));
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(centerLine(currentLine, maxLength, padExtra));
  }

  return lines.join("\n");
}

function centerLine(line, width, padExtra = false) {
  const totalPadding = width - line.length;
  const extraPadding = padExtra ? 4 : 2; // add 4 spaces more if it's doctor name
  const leftPadding = Math.floor(totalPadding / 2) + extraPadding;
  const rightPadding = totalPadding - Math.floor(totalPadding / 2) + extraPadding;
  return " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
}


function padFirstLineOnly(text, width = 40) {
  const lines = text.split("\n");
  if (lines.length > 0) {
    const firstLineLength = lines[0].trim().length;
    const totalPadding = width - firstLineLength;
    const leftPadding = totalPadding > 0 ? Math.floor(totalPadding / 2) : 0;
    lines[0] = " ".repeat(leftPadding) + lines[0].trim();
  }
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

    const wrappedMobile1 = wrapText(doctorName, 40, true);
    const wrappedMobile = wrapText(mobile);
    const wrappedAddress = wrapText(address);
    const wrappedDegree = wrapText(degree);

    const textLines = [
      padFirstLineOnly(wrappedMobile1),
      wrappedMobile,
      wrappedAddress,
      wrappedDegree,
    ];

    // Build drawtext filters for each line
    const drawtextFilters = textLines.map((line, index) => {
      return {
        filter: "drawtext",
        options: {
          fontfile: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
          text: escapeText(line.trim()),
          fontsize: 24,
          fontcolor: "white",
          x: "(w-text_w)/2",
          y: `${(index * 30) + 580}`, // Adjust 580 to control vertical position
          fix_bounds: 1,
        },
        inputs: index === 0 ? "boxed" : `t${index - 1}`,
        outputs: `t${index}`,
      };
    });

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
            y: "h-(h-1000)/2 - 10",
            width: "iw",
            height: 160,
            color: "black@0.3",
            t: "fill",
          },
          inputs: "tmp",
          outputs: "boxed",
        },
        ...drawtextFilters,
      ])
      .outputOptions([
        "-map", `[t${textLines.length - 1}]`,
        "-map", "1:a?",
        "-c:a", "copy",
        "-y",
      ])
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
      backgroundUrl,
     video_id
    } = req.query;

    // Validate required parameters
    if (!doctorName || !degree || !mobile || !address || !videoUrl  || !video_id ) {
      return res.status(400).json({ 
        error: "Missing required parameters: doctorName, degree, mobile, address, videoUrl" 
      });
    }
    const callbackUrl ="https://instamd.in/v6/company/ajanta/zillion/video/post_function.php";


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


    const responseData = {
      video_complete: true,
      message: "Video processed successfully",
      video_id,
      final_url: `http://43.204.238.249:5000/processed/${safeFilename}`
    };

    // If callback URL is provided, send the response to PHP API
    if (callbackUrl) {
      try {
        const phpApiResponse = await axios.post(callbackUrl, responseData);
        console.log('PHP API response:', phpApiResponse.data);
      } catch (apiError) {
        console.error('Error calling PHP API:', apiError.message);
        // Continue with the response even if PHP API call fails
      }
    }

    // Return response to original caller
    res.status(200).json(responseData);


    // res.status(200).json({
    //   video_complete: true,
    //   message: "Video processed successfully",
    //   file: safeFilename,
    //   final_url: `http://localhost:5000/processed/${safeFilename}`,
    // });

  } catch (error) {
    console.error("Processing error:", error);

    // If callback URL is provided, notify PHP API about the error
    if (callbackUrl) {
      try {
        await axios.post(callbackUrl, {
          video_complete: false,
          error: error.message || "Video processing failed"
        });
      } catch (apiError) {
        console.error('Error notifying PHP API about failure:', apiError.message);
      }
    }

    res.status(500).json({ 
      error: error.message || "Internal server error" 
    });
  }
};