const { Op } = require("sequelize");
const User = require("../../models/auth/userModel");

const searchUser = async (req, res) => {
  try {
    const { name } = req.query;

    // Validate if name parameter exists
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Search for users by name (case-insensitive)
const users = await User.findAll({
  where: {
    name: {
      [Op.iLike]: `%${name}%`
    }
  },
  attributes: ["userid", "name", "profilepic"]
});


    // Check if users were found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the found users
    res.status(200).json({ message: "Success", users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = searchUser;
