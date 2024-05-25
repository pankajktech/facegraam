const User = require("../../models/auth/userModel");

const getUserDetails = async (req, res) => {
  try {
    const userid = req.params.userid;

    if (!userid) {
      return res.status(400).json({ message: "userid is required" });
    }

    const user = await User.findOne({
      where: { userid },
      attributes: [
        "name",
        "username",
        "bio",
        "profilepic",
        "verified",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching user." });
  }
};

module.exports = getUserDetails;