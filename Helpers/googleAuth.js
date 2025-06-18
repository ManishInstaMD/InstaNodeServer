const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function getAuth() {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log("🔐 Access token refreshed");
    return oauth2Client;
  } catch (error) {
    console.error("❌ Failed to refresh token:", error.message);
    throw error;
  }
}

module.exports = { getAuth };
