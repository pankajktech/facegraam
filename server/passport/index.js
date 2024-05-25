const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { configDotenv } = require("dotenv");
const jwt = require("jsonwebtoken");
const { UserLoginType } = require("../constant");
const User = require("../models/auth/userModel");

configDotenv();



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      session: false,
      scope: ["profile", "email"],
    },
    async (_, __, profile, next) => {
      try {
        const existingUser = await User.findOne({
          where: {
            email: profile._json.email,
          },
        });

        if (existingUser) {
          const token = jwt.sign(
            {
              userid: existingUser.dataValues.userid,
              name: existingUser.dataValues.name,
              username: existingUser.dataValues.username,
              email: existingUser.dataValues.email,
              profilepic: existingUser.dataValues.profilepic,
              bio: existingUser.dataValues.bio,
              verified: existingUser.dataValues.verified,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          return next(null, token);
        } else {
          const user = await User.create({
            name: profile._json.name,
            username: profile._json.email.split("@")[0],
            email: profile._json.email,
            password: profile._json.sub,
            profilepic: profile._json.picture,
            verified: true,
            logintype: UserLoginType.GOOGLE,
          });

          const token = jwt.sign(
            {
              userid: user.userid,
              name: user.name,
              username: user.username,
              email: user.email,
              profilepic: user.profilepic,
              bio: user.bio,
              verified: user.verified,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          return next(null, token);
        }
      } catch (error) {
        return next(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
