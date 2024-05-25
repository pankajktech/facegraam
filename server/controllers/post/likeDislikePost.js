const  LikeDislike  = require("../../models/post/likeDislikeModel");


const toggleLikeDislikePost = async (req, res) => {
  const { postid } = req.params;
  const { userid } = req.user;

  try {
    if (!postid || !userid) {
      return res.status(400).json({ error: "Missing postid or userid in request body." });
    }

    // Check if the user has already liked or disliked the post
    const existingLikeDislike = await LikeDislike.findOne({
      where: { postid, userid: userid },
    });

    if (existingLikeDislike) {
      // Toggle the liked value
      const updatedLikeDislike = await existingLikeDislike.update({
        liked: !existingLikeDislike.liked,
      });

      if (updatedLikeDislike.liked) {
        return res.status(200).json({ message: "Post liked." });
      } else {
        return res.status(200).json({ message: "Post unliked." });
      }
    }

    // Create a new like for the post by the user
    await LikeDislike.create({ postid, userid: userid, liked: true });
    return res.status(200).json({ message: "Post liked." });
  } catch (error) {
    console.error("Error liking/disliking post:", error);
    return res.status(500).json({ error: "An error occurred while liking/disliking the post." });
  }
};

module.exports = toggleLikeDislikePost;