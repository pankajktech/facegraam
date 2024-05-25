const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/sequelize");

const LikeDislike = sequelize.define(
  "LikeDislike",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "likedislikes",
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

module.exports = LikeDislike;
