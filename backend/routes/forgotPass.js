import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import bcrypt from "bcrypt";


dotenv.config();

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; 

const client = twilio(accountSid, authToken);

// ✅ API to send OTP
router.post("/sendotp", async (req, res) => {
  const { phone } = req.body;
  const updated_phone_number =`+91${phone}` 
  
  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications.create({
        to:updated_phone_number ,
        channel: "sms", 
      });

    res.json({ success: true, message: "OTP sent successfully", status: verification.status });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

router.post("/verifyotp", async (req, res) => {
  const { phone, otp } = req.body;
  const updated_phone_number1 =`+91${phone}` 
  console.log(updated_phone_number1)


  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone and OTP are required" });
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks.create({
        to: updated_phone_number1,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP", error: error.message });
  }
});

router.put("/setnewpassword", async (req, res) => {
  const { phone, newPassword } = req.body;
  const updated_phone_number = `+91${phone}`;

  if (!phone || !newPassword) {
    return res.status(400).json({ success: false, message: "Phone number and new password are required" });
  }

  try {

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Failed to update password", error: error.message });
  }
});

export default router;
