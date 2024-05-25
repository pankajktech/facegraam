const Comment = require("../../models/post/commentModel");

const commentPost = async (req, res) => {
  const { comment, postid } = req.body;
  const { userid } = req.user;
  try {
    if (!postid || !comment || !userid) {
      return res.status(400).json({ message: "All Fields required." });
    }

    await Comment.create({ comment, postid, createdby: userid });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error While Commenting" });
  }
};

module.exports = commentPost;
