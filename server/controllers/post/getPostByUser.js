const Post = require("../../models/post/postModel");
const sequelize = require("../../utils/sequelize");
const redis = require("../../utils/redis");

const getPostByUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const currentUser = req.user.userid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Create a unique key for this query
    const redisKey = `userposts:${userid}:${page}:${limit}`;

    // Try to fetch the result from Redis first
    const cachedPosts = await redis.get(redisKey);
    if (cachedPosts) {
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const totalPosts = await Post.count({
      where: { createdby: userid },
    });

    const posts = await sequelize.query(
      `
      SELECT "posts".*, "user"."name", "user"."profilepic",
        COUNT(DISTINCT "likes"."id") AS "likesCount",
        COUNT(DISTINCT "comments"."id") AS "commentsCount",
        EXISTS (
          SELECT 1
          FROM "likedislikes" AS "userLikes"
          WHERE "userLikes"."postid" = "posts"."postid"
            AND "userLikes"."userid" = :userid
            AND "userLikes"."liked" = true
        ) AS "likedByCurrentUser"
      FROM "posts"
      LEFT JOIN "users" AS "user" ON "posts"."createdby" = "user"."userid"
      LEFT JOIN "likedislikes" AS "likes" ON "posts"."postid" = "likes"."postid" AND "likes"."liked" = true
      LEFT JOIN "comments" AS "comments" ON "posts"."postid" = "comments"."postid"
      WHERE "posts"."createdby" = :userid AND ("posts"."showpost" = true OR "posts"."createdby" = :currentUser)
      GROUP BY "posts"."postid", "user"."userid"
      ORDER BY "posts"."postedtime" DESC
      LIMIT :limit OFFSET :offset
    `,
      {
        replacements: { limit, offset, userid, currentUser },
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

module.exports = getPostByUser;