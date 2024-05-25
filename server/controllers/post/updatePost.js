const Post = require("../../models/post/postModel");
const getDataUri = require("../../utils/dataUri");
const Cloudinary = require("cloudinary").v2;


const updatePost = async (req, res) => {
  const createdby = req.user.userid;
  const postid = req.params.postid;
  
  try {
    const { title} = req.body;
    // Get the images from the request
    const images = req.files;

    let imageUrls = [];

    if(images.length > 1){
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
        id : image.public_id
      };
    });
    }
    // Update post
    await Post.update(
      { title, images: imageUrls },
      { where: { postid, createdby } }
    );

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log("Error", err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = updatePost;
