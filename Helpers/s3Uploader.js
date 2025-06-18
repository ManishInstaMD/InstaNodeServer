const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const REGION = "ap-south-1";
const BUCKET = "yt-process"; // Make sure this matches your exact bucket name

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false, // Use virtual-hosted style
});

const uploadToS3 = async (filePath) => {
  console.log("📁 Reading file for upload:", filePath);
  
  // Generate the key inside the function (removed from parameters)
  const key = `processed/videos/${path.basename(filePath)}`;
  const fileStream = fs.createReadStream(filePath);
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  const uploadParams = {
    Bucket: BUCKET,
    Key: key,
    Body: fileStream,
    ContentType: contentType,
  };

  console.log("🚀 Uploading to S3...");
  console.log("   ➤ Actual Bucket:", BUCKET);
  console.log("   ➤ Key:", key);
  console.log("   ➤ Content-Type:", contentType);
  console.log("   ➤ Region:", REGION);

  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log("✅ Upload successful:", result);

    fs.unlinkSync(filePath);
    console.log("🧹 Local file deleted:", filePath);

    return {
      url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
      key: key
    };
  } catch (err) {
    console.error("❌ Upload failed:", err);

    // Special handling for different error types
    if (err.name === "AccessControlListNotSupported") {
      console.log("ℹ️ Bucket is configured without ACL support - retrying without ACL");
      try {
        const retryResult = await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fs.createReadStream(filePath),
          ContentType: contentType,
        }));
        console.log("✅ Upload successful after ACL adjustment:", retryResult);
        fs.unlinkSync(filePath);
        return {
          url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
          key: key
        };
      } catch (retryErr) {
        console.error("❌ Retry also failed:", retryErr);
        throw retryErr;
      }
    } else if (err.name === "PermanentRedirect") {
      console.log("🔄 Retrying with path-style access...");
      const pathStyleS3 = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
      });

      try {
        const retryResult = await pathStyleS3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fs.createReadStream(filePath),
          ContentType: contentType,
        }));
        console.log("✅ Upload successful with path-style:", retryResult);
        fs.unlinkSync(filePath);
        return {
          url: `https://s3.${REGION}.amazonaws.com/${BUCKET}/${key}`,
          key: key
        };
      } catch (retryErr) {
        console.error("❌ Retry also failed:", retryErr);
        throw retryErr;
      }
    }

    throw err;
  }
};

module.exports = uploadToS3;