const { Op } = require("sequelize");
const Post = require("../../models/post/postModel");
const User = require("../../models/auth/userModel");

const searchPosts = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    const posts = await Post.findAll({
      where: {
        showpost: true,
        title: { [Op.iLike]: `%${searchQuery}%` },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "profilepic"],
        },
      ],
      order: [["postedtime", "DESC"]],
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = searchPosts;