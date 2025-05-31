// controllers/videoController.js
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfprobePath(ffprobePath);
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



async function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c:v", "libx264",
        "-crf", "28", // Lower = better quality, larger file
        "-preset", "slow",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-y"
      ])
      .on("start", (cmd) => {
        console.log("Compression started:", cmd);
      })
      .on("end", () => {
        const stats = fs.statSync(outputPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Compression complete.\n🗂️  File: ${outputPath}\n📦 Size: ${sizeInMB} MB`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Compression failed:", err);
        reject(err);
      })
      .save(outputPath);
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



async function hasAudioStream(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const hasAudio = metadata.streams.some(s => s.codec_type === 'audio');
      resolve(hasAudio);
    });
  });
}

async function processVideoWithBackground(videoPath, backgroundPath, outputPath, textData = {}, audioPath = null) {
  return new Promise(async (resolve, reject) => {
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

    const drawtextFilters = textLines.map((line, index) => ({
      filter: "drawtext",
      options: {
        fontfile: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        text: escapeText(line.trim()),
        fontsize: 24,
        fontcolor: "white",
        x: "(w-text_w)/2",
        y: `${(index * 30) + 580}`,
        fix_bounds: 1,
      },
      inputs: index === 0 ? "boxed" : `t${index - 1}`,
      outputs: `t${index}`,
    }));

    const mixedAudioPath = path.join(path.dirname(outputPath), `mixed_audio_${Date.now()}.aac`);

   const mixAudio = () => {
  return new Promise((resolveMix, rejectMix) => {
    ffmpeg()
      .input(videoPath)             // Main video (may contain original audio)
      .input(audioPath)             // Background music
      .complexFilter([
        "[1:a]volume=0.3[a2]",      // Lower background music to 30%
        "[0:a][a2]amix=inputs=2:duration=shortest:dropout_transition=2[aout]"
      ])
      .outputOptions([
        "-map", "[aout]",           // Map mixed audio output
        "-c:a", "aac",
        "-b:a", "128k"
      ])
      .save(mixedAudioPath)
      .on("end", () => {
        console.log("🎧 Mixed audio created:", mixedAudioPath);
        resolveMix(mixedAudioPath);
      })
      .on("error", (err) => {
        console.error("❌ Failed to mix audio:", err);
        rejectMix(err);
      });
  });
};


    const proceedWithVideo = (finalAudioPath, mapAudioInputIndex = null) => {
      const ffmpegCommand = ffmpeg()
        .input(backgroundPath)
        .input(videoPath);

      if (finalAudioPath && mapAudioInputIndex === 2) {
        ffmpegCommand.input(finalAudioPath);
      }

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
  "-map", `[t${textLines.length - 1}]`,
  "-c:v", "libx264",
  "-c:a", "aac",
  "-b:a", "128k",
  "-shortest",
  "-y",
];


      if (finalAudioPath && mapAudioInputIndex !== null) {
  outputOptions.splice(2, 0, "-map", `${mapAudioInputIndex}:a`);
}

      ffmpegCommand
        .complexFilter(complexFilters)
        .outputOptions(outputOptions)
        .output(outputPath)
        .on("start", (cmd) => console.log("🚀 Processing started:", cmd))
        .on("end", () => {
          console.log("✅ Successfully processed:", outputPath);
          if (fs.existsSync(mixedAudioPath)) fs.unlinkSync(mixedAudioPath);
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ Processing failed:", err);
          reject(err);
        })
        .run();
    };

    try {
      const videoHasAudio = await hasAudioStream(videoPath);
      const bgAudioProvided = audioPath && fs.existsSync(audioPath);
      const bgAudioHasAudio = bgAudioProvided ? await hasAudioStream(audioPath) : false;

      if (videoHasAudio && bgAudioHasAudio) {
        // Mix both
        mixAudio().then((mixedPath) => {
          proceedWithVideo(mixedPath, 2); // 2:a
        }).catch(reject);
      } else if (videoHasAudio) {
        // Only video audio
        proceedWithVideo(null, 1); // 1:a
      } else if (bgAudioHasAudio) {
        // Only background music
        proceedWithVideo(null, 2); // 2:a
      } else {
        // No audio at all
        console.warn("⚠️ No audio in video or background. Output will be silent.");
        proceedWithVideo(null); // no audio map
      }
    } catch (err) {
      reject(err);
    }
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
      audioUrl,
      video_id
    } = req.query;

    // Validate required parameters
    if (!doctorName || !degree || !mobile || !address || !videoUrl || !backgroundUrl || !video_id) {
      return res.status(400).json({
        error: "Missing required parameters: doctorName, degree, mobile, address, videoUrl, backgroundUrl, audioUrl, video_id"
      });
    }

    const callbackUrl = "https://instamd.in/v6/company/ajanta/zillion/video/post_function.php";

     // Step 1: Download video
    const downloadedVideoPath = await downloadFile(videoUrl, processedDir);

    // Step 2: Download background
    const backgroundPath = await downloadFile(backgroundUrl, processedDir);

    // Step 3: Download audio
    const downloadedAudioPath = await downloadFile(audioUrl, processedDir);

    // Step 4: Generate final output path
    const safeFilename = `output_${Date.now()}.mp4`;
    const outputPath = path.join(processedDir, safeFilename);

    // Step 5: Process video with overlays and audio
    await processVideoWithBackground(
      downloadedVideoPath,
      backgroundPath,
      outputPath,
      { doctorName, degree, mobile, address },
      downloadedAudioPath
    );

    // Step 6: Cleanup
    if (downloadedVideoPath) fs.unlinkSync(downloadedVideoPath);
    if (backgroundPath) fs.unlinkSync(backgroundPath);
    if (downloadedAudioPath) fs.unlinkSync(downloadedAudioPath);

    // // Step 8: Log output file size
    // const { size } = fs.statSync(outputPath);
    // console.log(`Output file saved: ${outputPath}`);
    // console.log(`Final video size: ${(size / (1024 * 1024)).toFixed(2)} MB`);

    // Step 9: Send success response and callback
    const responseData = {
      video_complete: true,
      message: "Video processed successfully",
      video_id,
      final_url: `http://3.110.196.88:5000/processed/${safeFilename}`
    };

    try {
      const phpApiResponse = await axios.post(callbackUrl, responseData);
      console.log('PHP API response:', phpApiResponse.data);
    } catch (apiError) {
      console.error('Error calling PHP API:', apiError.message);
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Processing error:", error);
    const callbackUrl = "https://instamd.in/v6/company/ajanta/zillion/video/post_function.php";

    // Notify failure
    try {
      await axios.post(callbackUrl, {
        video_complete: false,
        error: error.message || "Video processing failed"
      });
    } catch (apiError) {
      console.error('Error notifying PHP API about failure:', apiError.message);
    }

    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};


// after installing ffmpeg
// sudo apt-get install ffmpeg