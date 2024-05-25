const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/sequelize");

const Chat = sequelize.define(
  "Chat",
  {
    chatid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "chats",
  }
);

module.exports = Chat;
