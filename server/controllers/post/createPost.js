const Yup = require("yup");
const Post = require("../../models/post/postModel");

const Cloudinary = require("cloudinary").v2;

const User = require("../../models/auth/userModel");
const getDataUri = require("../../utils/dataUri");

// Validation schema
const postSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});


const createPost = async (req, res) => {
  try {
    // Validate request body
    await postSchema.validate(req.body, { abortEarly: false });

    const createdby = req.user.userid;
    const { title } = req.body;

    // Check if the user exists
    const user = await User.findByPk(createdby);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get the images from the request
    const images = req.files;

    let imageUrls = [];

    if (images.length > 0) {
      // Convert the images to data URIs
      images.forEach((image) => {
        image.dataUri = getDataUri(image);
      });

      // Upload images to Cloudinary
      const cloudinaryResponse = await Promise.all(
        images.map(async (image) => {
          return await Cloudinary.uploader.upload(image.dataUri.content);
        })
      );

      // Check if the image was uploaded successfully
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: "Error uploading image" });
      }

      imageUrls = cloudinaryResponse.map((image) => {
        return {
          image: image.url,
          id: image.public_id
        };
      });
    }

    // Create post
    const post = await Post.create({ title, createdby, images: imageUrls });


    const userDetails = await User.findByPk(createdby);

    const { name, profilepic } = userDetails;

    post.dataValues = {
      ...post.dataValues,
      name,
      profilepic
    }

    // Check if the post was created successfully
    if (!post) {
      return res.status(500).json({ message: "Error creating post" });
    } else {
      res.status(200).json({ message: "success", post });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = createPost;
