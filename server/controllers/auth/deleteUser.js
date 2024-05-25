const User = require("../../models/auth/userModel");
const Post = require("../../models/post/postModel");

const deleteUser = async (req, res) => {
  // Get the userId and userRole from the request object
  const { userid } = req.user;

  try {
    // Check if the user exists
    const user = await User.findByPk(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has posts
    const posts = await Post.findAll({ where: { createdby: userid } });
    if (posts && posts.length > 0) {
      return res.status(400).json({ message: "You have Posts" });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = deleteUser;
