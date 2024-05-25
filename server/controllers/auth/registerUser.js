const bcrypt = require("bcrypt");
const Yup = require("yup");
const crypto = require("crypto");
const User = require("../../models/auth/userModel");
const { Op } = require("sequelize");
const OTP = require("../../models/auth/otpModel");
const otpMailSender = require("../../utils/otpMailSender");
const getDataUri = require("../../utils/dataUri");
const cloudinary = require("cloudinary").v2;

const registerUser = async (req, res) => {
  try {
    // Validate request body
    await validationSchema.validate(req.body);

    const { name, username, email, password, bio } = req.body;
    const profilepic = getDataUri(req.file);

    // Check if the user or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is taken" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile pic to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(profilepic.content);

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
      bio,
      profilepic: cloudinaryResponse.secure_url,
    });

    // Generate OTP
    const otp = generateSixDigitOTP();

    // Create OTP entry
    await OTP.create({ email, otp, userId: user.id });

    // Send OTP via email
    try {
      await otpMailSender(email, otp);
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Error sending email" });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ errors: error.inner });
    }
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  username: Yup.string().required("username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  bio: Yup.string(),
});

const generateSixDigitOTP = () => {
  return crypto.randomInt(100000, 999999);
};

module.exports = registerUser;
