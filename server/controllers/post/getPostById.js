const Post = require("../../models/post/postModel");
const User = require("../../models/auth/userModel");
const LikeDislike = require("../../models/post/likeDislikeModel");
const Follower = require("../../models/auth/followerModel");

const getPostById = async (req, res) => {
  const postid = req.params.postid;
  const userid = req.user.userid;

  try {
    const post = await Post.findOne({
      where: { postid },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "profilepic", "userid"],
        },
      ]
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get the total likes
    const likes = await LikeDislike.count({
      where: { postid, liked: true },
    });

    // Attach likes to the post object
    post.dataValues.likes = likes;

    // Check if the requesting user follows the creator of the post
    const follower = await Follower.findOne({
      where: { followerid: userid, followid: post.createdby },
    });

    // Attach follower status to the post object
    post.dataValues.follower = follower ? true : false;

    res.status(200).json({ message: "success", post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = getPostById;