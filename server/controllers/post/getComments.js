const User = require("../../models/auth/userModel");
const Comment = require("../../models/post/commentModel");

const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;


    const totalComments = await Comment.count({ where: { postid: req.params.postid } });

    const comments = await Comment.findAll({
      where: { postid: req.params.postid },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["name", "profilepic"],
        },
      ],
        offset,
        limit,
        order: [["createdat", "DESC"]],
    });

    res.status(200).json({ totalComments: totalComments, comments: comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getComments;