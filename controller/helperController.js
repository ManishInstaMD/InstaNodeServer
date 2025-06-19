const { uploadToYouTube } = require("../Helpers/uploadOnYoutube");

const getId = async (req, res) => {
  try {
    const { original_video_id, title, description, tags } = req.body;

    if (!original_video_id) {
      return res.status(400).json({ error: "Missing original_video_id" });
    }

    const s3Url = `https://yt-process.s3.ap-south-1.amazonaws.com/processed/videos/${original_video_id}`;
    console.log("📥 Queued for YouTube upload:", original_video_id, s3Url);

    // Capture YouTube response here
    const youtubeResponse = await uploadToYouTube(s3Url, { title, description, tags });

    return res.json({
      message: "YouTube upload completed",
      original_video_id,
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
