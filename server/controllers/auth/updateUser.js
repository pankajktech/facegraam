const User = require("../../models/auth/userModel");
const Yup = require("yup");

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  gender: Yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
  bio: Yup.string().required("Bio is required"),
  birthdate: Yup.date().required("Birthdate is required"),
});

const updateUser = async (req, res) => {
  try {
    // Validate request body
    await validationSchema.validate(req.body, { abortEarly: false });

    const { userid } = req.user;

    // Check if user ID exists
    if (!userid) {
      return res.status(401).send("Unauthorized");
    }

    // Find the user by ID
    const user = await User.findByPk(userid);

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user attributes
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.bio = req.body.bio;
    user.birthdate = req.body.birthdate;

    // Save the updated user
    await user.save();

    return res.status(200).send("User updated successfully");
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = updateUser;
