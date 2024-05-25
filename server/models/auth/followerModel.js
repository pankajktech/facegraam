const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/sequelize");

const Follower = sequelize.define(
  "Follower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    followerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "followers",
  }
);

module.exports = Follower;
