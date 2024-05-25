const express = require("express");
const { configDotenv } = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const Cloudinary = require("cloudinary").v2;

const sequelize = require("../utils/sequelize");
const socketManager = require("../socket/index");

// Routes for all the apps
const userRouter = require("../routes/userRoutes");
const postRouter = require("../routes/postRoutes");
const chatRoutes = require("../routes/chatRoutes");

// Server and Socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");

// Configuring the environment variables
configDotenv();

const app = express();

// Cloudinary configuration
Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Passport configuration
app.use(passport.initialize());
require("../passport/index");


const corsOptions = {
  origin: ["http://localhost:5173", "https://facegraam.vercel.app"],
  credentials: true,
};

// Middlewares
app.use(
  cors(corsOptions)
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRouter, postRouter, chatRoutes);

// Syncing the database
sequelize

// Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {corsOptions},
});

// Socket.io manager
socketManager(io);

// Starting the server
const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
