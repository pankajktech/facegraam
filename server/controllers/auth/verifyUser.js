const User = require("../../models/auth/userModel");
const OTP = require("../../models/auth/otpModel");
const verifiedMailSender = require("../../utils/verifiedMailSender");

const OTP_EXPIRATION_TIME = 10 * 60 * 1000;

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Get the user from the database
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.dataValues.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Query the OTP from the database
    const storedOTP = await OTP.findOne({
      where: { email },
      order: [["createdat", "DESC"]],
    });

    
    const storedOTPValue = storedOTP.dataValues.otp;

    // Check if the OTP exists and is not expired
    if (!storedOTP || Date.now() - storedOTP.dataValues.createdat.getTime() > OTP_EXPIRATION_TIME) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // convert the provided OTP and stored OTP to string
    const providedOTP = otp.toString();
    const storedOTPValue1 = storedOTPValue.toString();

    // Compare the provided OTP with the stored OTP
    if (providedOTP === storedOTPValue1) {
      console.log("OTP matched");
      // Update user's verification status to true
      await user.update({ verified: true });

      // Delete OTP from the database after successful verification
      await storedOTP.destroy();

      // Send verified email
      await verifiedMailSender(user.dataValues.email, user.dataValues.username, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent");
        }
      });

      return res.status(200).json({ message: "User verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(
      "Error verifying OTP and updating user verification status:",
      error
    );
    return res.status(500).json({
      message: "Failed to verify OTP and update user verification status",
    });
  }
};

module.exports = verifyUser;
