const fs = require("fs");
const axios = require("axios");
const { google } = require("googleapis");
const { getAuth } = require("./googleAuth"); // ✅ Refreshable auth helper

/**
 * Upload a video from S3 to YouTube.
 * @param {string} s3Url - Direct S3 URL of the video file.
 * @param {object} meta - Metadata for YouTube upload.
 * @param {string} meta.title - Title of the video.
 * @param {string} meta.description - Description of the video.
 * @param {string[]} meta.tags - Tags for the video.
 */
const uploadToYouTube = async (s3Url, meta = {}) => {
  const {
    title = "Uploaded from Node.js",
    description = "This video was uploaded directly from S3 via Node.js",
    tags = ["nodejs", "youtube"],
  } = meta;

  try {
    const auth = await getAuth(); // ✅ Refreshes token using refresh_token
    const youtube = google.youtube({ version: "v3", auth });

    console.log("📡 Downloading video from S3...");
    const response = await axios.get(s3Url, { responseType: "stream" });

    const videoStream = response.data;

    console.log("🚀 Uploading to YouTube...");
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "22", // People & Blogs
        },
        status: {
          privacyStatus: "public", // Can be "private" or "unlisted"
        },
      },
      media: {
        body: videoStream,
      },
    });

    console.log("✅ YouTube Upload Complete:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ YouTube upload failed:", err.message);
    throw err;
  }
};

module.exports = { uploadToYouTube };
