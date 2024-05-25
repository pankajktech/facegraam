const Post = require("../../models/post/postModel");
const Comment = require("../../models/post/commentModel");
const LikeDislike = require("../../models/post/likeDislikeModel");

const deletePost = async (req, res) => {
  const createdby = req.user.userid;
  const postid = req.params.postid;

  try {
    // Find the post by postid and createdby
    const post = await Post.findOne({
      where: { postid, createdby },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdby !== createdby) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the post
    await post.destroy();

    // Delete associated likes/dislikes
    await LikeDislike.destroy({ where: { postid } });

    // Delete associated comments
    await Comment.destroy({ where: { postid } });

    res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = deletePost;
