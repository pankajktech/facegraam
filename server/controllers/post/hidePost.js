const Post = require("../../models/post/postModel");
const sequelize = require("sequelize");

const hidePost = async (req, res) => {
  const createdby = req.user.userid;
  const postid = req.params.postid;

  try {
    const [numUpdated, updatedPosts] = await Post.update(
      { showpost: sequelize.literal("NOT showpost") },
      {
        where: { postid: postid, createdby: createdby },
        returning: true,
      }
    );

    console.log(numUpdated, updatedPosts);

    if (numUpdated === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (updatedPosts[0].createdby !== createdby) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedPost = updatedPosts[0];

    const message =
      updatedPost.showpost === 0 ? "Post Hidden" : "Post Un-Hidden";
    res.status(200).json({ message: message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = hidePost;
