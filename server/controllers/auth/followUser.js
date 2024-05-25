const { Op } = require("sequelize");
const Follower = require("../../models/auth/followerModel");

const followUser = async (req, res) => {
  const followid = req.params.followid;
  const followerid = req.user.userid;

  try {
    if (followid == followerid) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if the user is already following the target user
    const existingFollow = await Follower.findOne({
      where: { followid, followerid },
    });

    if (existingFollow) {
      // Unfollow the target user
      await existingFollow.destroy();
      return res.status(200).json({ message: "Unfollowed" });
    } else {
      // Follow the target user
      await Follower.create({ followid, followerid });
      return res.status(200).json({ message: "Followed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = followUser;
