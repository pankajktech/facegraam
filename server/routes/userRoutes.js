const express = require("express");
const fileHandleMiddleware = require("../middleware/fileHandleMiddleware");
const registerUser = require("../controllers/auth/registerUser");
const loginUser = require("../controllers/auth/loginUser");
const verifyUser = require("../controllers/auth/verifyUser");
const updateUser = require("../controllers/auth/updateUser");
const authMiddleware = require("../middleware/authMiddleware");
const followUser = require("../controllers/auth/followUser");
const getUserDetails = require("../controllers/auth/getUserDetails");
const searchUser = require("../controllers/auth/searchUser");
const passport = require("passport");
const sendEmailOtp = require("../controllers/auth/sendEmailOtp");
const { getFollowLists } = require("../controllers/auth/getFollowLists");

const userRouter = express.Router();

userRouter
  .route("/register")
  .post(fileHandleMiddleware.single("profilepic"), registerUser);

userRouter
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

userRouter.route("/auth/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    if (req.user) {
      const token = req.user;
      res.cookie("token", token, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.redirect(`${process.env.CLIENT_URL}/all/posts`);
    }
  },
);

userRouter.route("/sendotp/user").post(sendEmailOtp);

userRouter.route("/verify/user").post(verifyUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/profile").get(authMiddleware, (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
  } else {
    res.status(200).json({ message: "success", user });
  }
});

userRouter.route("/logout").get((req, res) => {
  res.clearCookie("token", {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "success" });
});

userRouter.route("/update").patch(updateUser);

userRouter.route("/user/search").get(searchUser);

userRouter.route("/user/profile/:userid").get(authMiddleware, getUserDetails);

userRouter.route("/user/follow/:followid").get(authMiddleware, followUser);

userRouter
  .route("/user/followlist/:userid")
  .get(authMiddleware, getFollowLists);

module.exports = userRouter;
