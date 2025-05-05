const fetch = require("node-fetch");
const base64 = require("base-64");
const User = require("../models/User"); // Import User Model
const {sendEmail} = require("../utils/nodemailer"); // Assuming this is the SendEmail utility

// Zoom API Credentials
const zoomAccountId = "1aHQJWLsRxy7iT3DWxUDiQ";
const zoomClientId = "1pUtWllUQYuEcue4pZxJxg";
const zoomClientSecret = "12mQmclyQPucqFs8WZ3Glf3VGzmd6S1v";

// Generate Authorization Headers
const generateHeaders = () => ({
    "Authorization": `Basic ${base64.encode(`${zoomClientId}:${zoomClientSecret}`)}`,
    "Content-Type": "application/json",
});

// Generate Zoom Access Token
const generateZoomAccessToken = async () => {
    try {
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
            {
                method: "POST",
                headers: generateHeaders(),
            }
        );

        const result = await response.json();
        if (!result.access_token) {
            throw new Error("Failed to generate Zoom access token.");
        }

        return result.access_token;
    } catch (error) {
        console.error("generateZoomAccessToken Error:", error);
        throw error;
    }
};



const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

const filterInvalidEmails = (emails) => {
    return emails.filter(email => validateEmail(email));
};

// Create Zoom Meeting and Save to Database
const createMeeting = async (req, res) => {
    try {
        const zoomAccessToken = await generateZoomAccessToken();

        const {
            host_email,  
            topic,
            start_time,
            duration,
            timezone,
            participants_emails 
        } = req.body;

       
        const user = await User.findOne({ where: { email: host_email } });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email!" });
        }

        const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${zoomAccessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic: topic || "Default Meeting",
                type: 2,
                start_time,
                duration: duration || 60,
                timezone: timezone || "Asia/Kolkata",
                host_email: host_email,  
                settings: {
                    allow_multiple_devices: true,
                    approval_type: 2,
                },
                email_notification: true,
                host_video: true,
                participant_video: true,
                mute_upon_entry: true,
                private_meeting: true,
                waiting_room: false,
            }),
        });

        const result = await response.json();
        if (result.code) {
            return res.status(400).json({ error: result.message });
        }

        // Save meeting details to the user record
        user.zoomMeetingId = result.id;
        user.zoomJoinUrl = result.join_url;
        user.zoomStartUrl = result.start_url;
        await user.save();
 // Prepare email invitation details
 const meetingLink = result.join_url;
 const subject = "Zoom Meeting Invitation";
 const text = `You are invited to a Zoom meeting. Join the meeting using the link below:\n\n${meetingLink}`;
 const validEmails = filterInvalidEmails(participants_emails);
 if (validEmails.length === 0) {
     console.log("No valid email addresses found.");
 } else {
     await sendEmail(validEmails, meetingLink, subject, text);
 }

 res.status(200).json({
     message: "Meeting created and emails sent successfully!",
     meeting: result,
 });
    } catch (error) {
        console.error("createMeeting Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createMeeting };
