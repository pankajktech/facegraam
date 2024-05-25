const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../utils/sequelize");
const Chat = require("./chatModel");

class ChatMessage extends Model {}

ChatMessage.init(
  {
    messageid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    senderid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ChatMessage",
    timestamps: false,
    tableName: "chatmessage",
  }
);

ChatMessage.belongsTo(Chat, {
  foreignKey: "chatid",
  as: "Chat",
});

Chat.hasMany(ChatMessage, {
  foreignKey: "chatid",
  as: "Messages",
});

module.exports = ChatMessage;
