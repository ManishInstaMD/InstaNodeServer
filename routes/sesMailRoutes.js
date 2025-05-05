const express = require("express");
const router = express.Router();
const { handleSesWebhook, getCampaignStats, sendEmail} = require("../controller/sesMailController");


router.post("/sendEmail", sendEmail)

router.post("/ses-webhook", handleSesWebhook);

router.get("/email-stats", getCampaignStats);


module.exports = router;
