const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../utils/sequelize");
const Comment = require("../post/commentModel");
const Chat = require("../chat/chatModel");
const Post = require("../post/postModel");
const Follower = require("./followerModel");

class User extends Model {}

User.init(
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    profilepic: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    logintype: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "EMAILPASSWORD",
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false,
    tableName: "users",
  }
);

const ChatUser = sequelize.define(
  "ChatUser",
  {
    chatid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userid",
      },
    },
  },
);

User.belongsToMany(Chat, { through: ChatUser, foreignKey: "userid" });
Chat.belongsToMany(User, { through: ChatUser, foreignKey: "chatid" });

User.hasMany(Comment, { foreignKey: "createdby", as: "comments" });
Comment.belongsTo(User, { foreignKey: "createdby", as: "user" });


User.hasMany(Post, { foreignKey: "createdby", as: "posts" });
Post.belongsTo(User, { foreignKey: "createdby", as: "user" });

Follower.belongsTo(User, { foreignKey: "followerid", as: "follower" });
Follower.belongsTo(User, { foreignKey: "followid", as: "following" });


module.exports = User;