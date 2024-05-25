const express = require("express");
const fileHandleMiddleware = require("../middleware/fileHandleMiddleware");
const createPost = require("../controllers/post/createPost");
const authMiddleware = require("../middleware/authMiddleware");
const getPostById = require("../controllers/post/getPostById");
const getAllPosts = require("../controllers/post/getAllPosts");
const getPostByUser = require("../controllers/post/getPostByUser");
const commentPost = require("../controllers/post/commentPost");
const updatePost = require("../controllers/post/updatePost");
const deletePost = require("../controllers/post/deletePost");
const hidePost = require("../controllers/post/hidePost");
const toggleLikeDislikePost = require("../controllers/post/likeDislikePost");
const getComments = require("../controllers/post/getComments");
const searchPosts = require("../controllers/post/searchPost");
const getLikeDislikeStatus = require("../controllers/post/getLikeDislikeStatus");

const postRouter = express.Router();


//This route is used to create a post
postRouter.route("/create")
  .post(authMiddleware, fileHandleMiddleware.array("images"), createPost);

  //This route is used to get all the posts
postRouter.route("/posts")
  .get(authMiddleware, getAllPosts);

  //This route is used to search posts
postRouter.route("/posts/search")
  .get(authMiddleware, searchPosts);

  //This route is used to get all the posts of a user
postRouter.route("/user/posts/:userid")
  .get(authMiddleware, getPostByUser);

  //This route is used to get a post by its id
postRouter.route("/post/:postid")
  .get(authMiddleware, getPostById);

  //This route is used to update a post
postRouter.route("/post/update/:postid")
  .patch(authMiddleware, fileHandleMiddleware.array("images"), updatePost);

  //This route is used to delete a post
postRouter.route("/post/delete/:postid")
  .delete(authMiddleware, deletePost);

  //This route is used to hide or unhide a post from the user's feed
postRouter.route("/post/hide/:postid")
  .get(authMiddleware, hidePost);

  //This route is used to like or dislike a post
postRouter.route("/post/likedislike/:postid")
  .get(authMiddleware, toggleLikeDislikePost);

  //This route is used to get the like or dislike status of a post
postRouter.route("/post/like/status/:postid")
  .get(authMiddleware, getLikeDislikeStatus);

  //This route is used to comment on a post
postRouter.route("/post/comment")
  .post(authMiddleware, commentPost);

  //This route is used to get the comments of a post
postRouter.route("/get/comment/:postid")
  .get(authMiddleware, getComments);

module.exports = postRouter;
