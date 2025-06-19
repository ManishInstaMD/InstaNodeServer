const axios = require("axios");
const { uploadToYouTube } = require("../Helpers/uploadOnYoutube");

const getId = async (req, res) => {
  try {
    const { original_video_id, title, description, tags, video_id } = req.body;

    if (!original_video_id || !video_id) {
      return res
        .status(400)
        .json({ error: "Missing original_video_id or video_id" });
    }

    const s3Url = `https://yt-process.s3.ap-south-1.amazonaws.com/processed/videos/${original_video_id}`;
    console.log("📥 Queued for YouTube upload:", original_video_id, s3Url);

    // Upload to YouTube
    const youtubeResponse = await uploadToYouTube(s3Url, {
      title,
      description,
      tags,
    });

    // Callback payload
    const callbackUrl =
      "https://phpstack-894223-5375430.cloudwaysapps.com/youtube/separate_data.php";
    const responseData = {
      video_complete: true,
      message: "Video processed successfully and uploaded to YouTube",
      video_id,
      youtube_url: `https://youtube.com/watch?v=${youtubeResponse.id}`,
      original_video_id: original_video_id,
    };

    console.log("📡 Callback data:", responseData);

    // Send callback to external URL
    try {
      const apiRes = await axios.post(callbackUrl, responseData, {
        headers: {
          "Content-Type": "application/json", // Important for PHP to parse it correctly
        },
      });
      console.log("🔄 Callback sent:", apiRes.data);
    } catch (err) {
      console.error("❌ Callback failed:", err.message);
    }

    // Send final response
    return res.json({
      message: "YouTube upload completed",
      original_video_id,
      video_id,
      s3Url,
      youtube_video_id: youtubeResponse.id,
      youtube_url: `https://youtube.com/watch?v=${youtubeResponse.id}`,
    });
  } catch (err) {
    console.error("❌ Error in /youtube/queue:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getId };
