const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../utils/sequelize");
const LikeDislike = require("./likeDislikeModel");
const Comment = require("./commentModel");

class Post extends Model {}

Post.init(
  {
    postid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    createdby: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    postedtime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    showpost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Post",
    timestamps: false,
    tableName: "posts",
  }
);

// Define association with LikeDislike model
Post.hasMany(LikeDislike, { foreignKey: "postid", as: "likes" });
Post.hasMany(Comment, { foreignKey: "postid", as: "comments" });

module.exports = Post;
