
const crypto = require('crypto');
const OTP = require('../../models/auth/otpModel');
const otpMailSender = require('../../utils/otpMailSender');

// Generate a random 6 digit OTP
const generateSixDigitOTP = () => {
    return crypto.randomInt(100000, 999999);
};

const sendEmailOtp = async (req, res) => {
    const { email} = req.body;

    // Generate OTP
    const otp = generateSixDigitOTP();

    // Create OTP entry
    await OTP.create({ email, otp });

    // Send OTP via email
    try {
        await otpMailSender(email, otp);
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email" });
    }
}

module.exports = sendEmailOtp;