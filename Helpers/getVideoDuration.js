const ffmpeg = require("fluent-ffmpeg");

const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(s => s.codec_type === "video");
      const duration = videoStream?.duration ? Math.ceil(videoStream.duration) : 30;

      const currentTime = new Date().toLocaleString();
      console.log(`🕒 Video duration: ${duration}s | Checked at: ${currentTime}`);

      resolve(duration);
    });
  });
};

module.exports = { getVideoDuration };
