const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);
const https = require("https");
const http = require("http");
const axios = require("axios");
const mime = require("mime-types");
const { addJob, getQueueSize } = require("../Helpers/jobQueue");
const { getVideoDuration } = require("../Helpers/getVideoDuration");
const uploadToS3 = require("../Helpers/s3Uploader");

const processedDir = path.join(__dirname, "../processed");
fs.mkdirSync(processedDir, { recursive: true });
fs.chmodSync(processedDir, 0o777);

function downloadFile(url, directory) {
  return new Promise((resolve, reject) => {
    try {
      let filename = path.basename(new URL(url).pathname);

      // Add default .mp4 extension if missing
      if (!path.extname(filename)) {
        filename += ".mp4";
      }

      const filePath = path.join(directory, filename);
      const fileStream = fs.createWriteStream(filePath);
      const protocol = url.startsWith("https") ? https : http;

      protocol
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `Failed to download ${url}. Status code: ${response.statusCode}`
              )
            );
            return;
          }

          // Try to get MIME type from headers
          const contentType = response.headers["content-type"] || "unknown";
          const extensionFromMime = mime.extension(contentType) || "unknown";

          console.log(`\n🔽 Downloading from: ${url}`);
          console.log(`📄 File name: ${filename}`);
          console.log(`📁 Save path: ${filePath}`);
          console.log(`📦 Content-Type: ${contentType}`);
          console.log(`📎 Extension (from MIME): .${extensionFromMime}`);

          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();
            if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
              reject(new Error(`Downloaded file is empty: ${filePath}`));
            } else {
              resolve(filePath);
            }
          });

          fileStream.on("error", (err) => {
            fs.unlinkSync(filePath);
            reject(err);
          });
        })
        .on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
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
  const extraPadding = padExtra ? 4 : 2;
  const leftPadding = Math.floor(totalPadding / 2) + extraPadding;
  const rightPadding =
    totalPadding - Math.floor(totalPadding / 2) + extraPadding;
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
  return text
    .replace(/\\/g, '\\\\')   // escape backslashes
    .replace(/:/g, '\\:')     // escape colons (FFmpeg requirement)
    .replace(/'/g, "\\'");    // escape single quotes
}


async function hasAudioStream(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) return resolve(false);
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return resolve(false);
      const hasAudio = metadata.streams.some((s) => s.codec_type === "audio");
      resolve(hasAudio);
    });
  });
}

async function processVideoWithBackground(
  videoPath,
  backgroundPath,
  outputPath,
  textData = {},
  audioPath = null
) {
  return new Promise(async (resolve, reject) => {
    const {
      doctorName = "",
      degree = "",
      mobile = "",
      address = "",
    } = textData;

    const textLines = [
      padFirstLineOnly(wrapText(doctorName, 40, true)),
      wrapText(degree),
      wrapText(mobile),
      wrapText(address),
    ];

    const drawtextFilters = textLines.map((line, i) => ({
      filter: "drawtext",
      options: {
        fontfile: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        text: escapeText(line.trim()),
        fontsize: 24,
        fontcolor: "white",
        x: "(w-text_w)/2",
        y: `${i * 30 + 580}`,
        fix_bounds: 1,
      },
      inputs: i === 0 ? "boxed" : `t${i - 1}`,
      outputs: `t${i}`,
    }));

    const mixedAudioPath = path.join(
      path.dirname(outputPath),
      `mixed_audio_${Date.now()}.aac`
    );

    const mixAudio = () =>
      new Promise((resolveMix, rejectMix) => {
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .complexFilter([
            "[1:a]volume=0.2[a2]",
            "[0:a][a2]amix=inputs=2:duration=shortest:dropout_transition=2[aout]",
          ])
          .outputOptions(["-map", "[aout]", "-c:a", "aac", "-b:a", "128k"])
          .save(mixedAudioPath)
          .on("end", () => resolveMix(mixedAudioPath))
          .on("error", rejectMix);
      });

    const proceedWithVideo = (finalAudioPath, mapAudioIndex = null) => {
      const ffmpegCommand = ffmpeg().input(backgroundPath).input(videoPath);
      if (finalAudioPath && mapAudioIndex === 2)
        ffmpegCommand.input(finalAudioPath);

      const complexFilters = [
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
      ];

      const outputOptions = [
        "-map",
        `[t${textLines.length - 1}]`,
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-shortest",
        "-y",
      ];
      if (mapAudioIndex !== null)
        outputOptions.splice(2, 0, "-map", `${mapAudioIndex}:a`);

      ffmpegCommand
        .complexFilter(complexFilters)
        .outputOptions(outputOptions)
        .output(outputPath)
        .on("start", (cmd) => console.log("🚀 FFmpeg command:", cmd))
        .on("end", () => {
          console.log("✅ Processing completed:", outputPath);
          if (fs.existsSync(mixedAudioPath)) fs.unlinkSync(mixedAudioPath);
          resolve();
        })
        .on("error", reject)
        .run();
    };

    try {
      const hasVideoAudio = await hasAudioStream(videoPath);
      const hasBGMusic =
        audioPath &&
        fs.existsSync(audioPath) &&
        (await hasAudioStream(audioPath));

      if (hasVideoAudio && hasBGMusic) {
        const mixedPath = await mixAudio();
        proceedWithVideo(mixedPath, 2);
      } else if (hasVideoAudio) {
        proceedWithVideo(null, 1);
      } else if (hasBGMusic) {
        proceedWithVideo(null, 2);
      } else {
        proceedWithVideo(null);
      }
    } catch (err) {
      reject(err);
    }
  });
}

exports.uploadHandler = async (req, res) => {
  const {
    doctorName,
    degree,
    mobile,
    address,
    videoUrl,
    backgroundUrl,
    audioUrl,
    video_id,
  } = req.query;

  const callbackUrl =
    "https://instamd.in/v6/company/ajanta/zillion/video/post_function.php";

  if (
    !doctorName ||
    !degree ||
    !mobile ||
    !address ||
    !videoUrl ||
    !backgroundUrl ||
    !video_id
  ) {
    return res.status(400).json({
      error:
        "Missing required parameters: doctorName, degree, mobile, address, videoUrl, backgroundUrl, video_id",
    });
  }

  let videoPath, backgroundPath, audioPath;
  try {
    console.log("📥 Downloading video...");
    videoPath = await downloadFile(videoUrl, processedDir);
    console.log("✅ Video downloaded:", {
      path: videoPath,
      size: fs.statSync(videoPath).size,
      ext: path.extname(videoPath),
    });

    console.log("📥 Downloading background...");
    backgroundPath = await downloadFile(backgroundUrl, processedDir);
    console.log("✅ Background downloaded:", {
      path: backgroundPath,
      size: fs.statSync(backgroundPath).size,
      ext: path.extname(backgroundPath),
    });

    if (audioUrl) {
      console.log("📥 Downloading audio...");
      audioPath = await downloadFile(audioUrl, processedDir);
      console.log("✅ Audio downloaded:", {
        path: audioPath,
        size: fs.statSync(audioPath).size,
        ext: path.extname(audioPath),
      });
    }

    const outputFile = `output_${Date.now()}.mp4`;
    const outputPath = path.join(processedDir, outputFile);

    const estimatedDuration = await getVideoDuration(videoPath);

    console.log("🎬 Adding job to queue...");
    addJob(async () => {
      await processVideoWithBackground(
        videoPath,
        backgroundPath,
        outputPath,
        { doctorName, degree, mobile, address },
        audioPath
      );
      console.log("✅ Video processed successfully:", outputPath);

      // Clean up temporary files
      [videoPath, backgroundPath, audioPath].forEach((file) => {
        if (file && fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log("🧹 Deleted temp file:", file);
        }
      });
      const s3Key = `processed/${outputFile}`;
      const s3Url = await uploadToS3(outputPath, "your-bucket-name", s3Key);
      console.log("☁️ Uploaded to S3:", s3Url);

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log("🧹 Deleted local processed video:", outputPath);
      }
      // console.log("📡 Preparing callback data...", outputFile);

      const finalUrl = s3Url;
      console.log("📡 Sending callback to:", callbackUrl);
      console.log("📡 Sending finalUrl to:", finalUrl);
      const responseData = {
        video_complete: true,
        message: "Video processed successfully",
        video_id,
        final_url: finalUrl.url,
        original_video_id: outputFile,
      };

      console.log("📡 Callback data:", responseData);
      

      // Send callback
      try {
        const apiRes = await axios.post(callbackUrl, responseData);
        console.log("🔄 Callback sent:", apiRes.data);
      } catch (err) {
        console.error("❌ Callback failed:", err.message);
      }
    }, estimatedDuration);

    // Immediately respond that job has been queued
    res.status(202).json({
      message: "Video processing job added to queue",
      video_id,
      estimated_duration: estimatedDuration,
      queue_size: getQueueSize(),
    });
  } catch (error) {
    console.error("❌ Processing error:", error.message);

    // Report failure via callback
    try {
      await axios.post(callbackUrl, {
        video_complete: false,
        error: error.message,
        video_id,
      });
      console.log("📡 Failure callback sent.");
    } catch (e) {
      console.error("❌ Failure callback error:", e.message);
    }

    // Attempt cleanup
    [videoPath, backgroundPath, audioPath].forEach((file) => {
      if (file && fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log("🧹 Cleaned up after error:", file);
      }
    });

    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
