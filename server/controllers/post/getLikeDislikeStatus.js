const  LikeDislike  = require("../../models/post/likeDislikeModel");

const getLikeDislikeSataus = async (req, res) => {
  const { postid } = req.params;
  const { userid } = req.user;

  try {
    if (!postid || !userid) {
      return res.status(400).json({ error: "Missing postid or userid in request body." });
    }

    const existingLikeDislike = await LikeDislike.findOne({
      where: { postid, userid: userid },
    });

    if (existingLikeDislike) {
      return res.status(200).json({ liked: existingLikeDislike.liked });
    }

    return res.status(200).json({ liked: false });
    
  } catch (error) {
    console.error("Error liking/disliking post:", error);
    return res.status(500).json({ error: "An error occurred while liking/disliking the post." });
  }
};

module.exports = getLikeDislikeSataus;