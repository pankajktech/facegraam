const Post = require("../../models/post/postModel");
const redis = require("../../utils/redis");
const sequelize = require("../../utils/sequelize");

const getAllPosts = async (req, res) => {
  try {
    const userid = req.user.userid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Create a unique key for this query
    const redisKey = `posts:${userid}:${page}:${limit}`;

    // Try to fetch the result from Redis first
    const cachedPosts = await redis.get(redisKey);

    if (cachedPosts) {
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const totalPosts = await Post.count({ where: { showpost: true } });

    const posts = await sequelize.query(
      `
      SELECT p.*, u.name, u.profilepic,
        COALESCE(l.likesCount, 0) AS "likesCount",
        COALESCE(c.commentsCount, 0) AS "commentsCount",
        EXISTS (
          SELECT 1 FROM likedislikes ul
          WHERE ul.postid = p.postid
          AND ul.userid = :userid
          AND ul.liked = true
        ) AS "likedByCurrentUser"
      FROM posts p
      JOIN users u ON p.createdby = u.userid
      LEFT JOIN (
        SELECT postid, COUNT(*) AS likesCount
        FROM likedislikes
        WHERE liked = true
        GROUP BY postid
      ) l ON p.postid = l.postid
      LEFT JOIN (
        SELECT postid, COUNT(*) AS commentsCount
        FROM comments
        GROUP BY postid
      ) c ON p.postid = c.postid
      WHERE p.showpost = true
      ORDER BY p.postedtime DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: { limit, offset, userid },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Cache the result in Redis
    await redis.set(redisKey, JSON.stringify({ totalPosts, posts }), "EX", 30);

    res.status(200).json({ totalPosts, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAllPosts;
