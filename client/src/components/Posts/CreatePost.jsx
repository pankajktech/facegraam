import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import ClearIcon from "@mui/icons-material/Clear";

const validationSchema = yup.object().shape({
  title: yup.string().min(2).required("Title is required"),
  images: yup
    .mixed()
    .test("fileSize", "image should be less than 1MB", (value) => {
      const files = Array.from(value);
      return files.every((file) => file.size <= 1000000);
    })
    .test("fileType", "Only images are allowed", (value) => {
      const files = Array.from(value);
      return files.every((file) => file.type.includes("image"));
    }),
});

const CreatePost = ({ posts, setPosts }) => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", title);
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success("Post created successfully");
        setPosts([response.data.post, ...posts]);
        setImages([]);
        setTitle("");
        setShowPost(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  // Handle remove image
  const handleRemoveImage = (index, e) => {
    e.preventDefault();
    const newImages = images.filter((image, i) => i !== index);
    setImages(newImages);
  };

  //handle create post
  const handleCreatePost = () => {
    setShowPost(!showPost);
  };

  return (
    <Box sx={{ zIndex: 10 }}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCreatePost}
        sx={{
          background: "#4db8ff",
          borderRadius: "8px",
          color: "#fff",
          height: "40px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        Share Your Thoughts
      </Button>

      {showPost && (
        <form
          name="form"
          className="animate_in"
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Box mb={2} position="relative">
            <TextField
              id="title"
              label="Share your thoughts"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="standard"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <>
                    <IconButton
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      sx={{ padding: 0, marginRight: 2 }}
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </>
                ),
              }}
            />
            {showEmojiPicker && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 1,
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => {
                    setTitle(title + emoji.native);
                  }}
                />
              </Box>
            )}
          </Box>

          <TextField
            id="images"
            type="file"
            InputLabelProps={{ shrink: true }}
            error={!!errors.images}
            helperText={errors.images?.message}
            onChange={handleImageChange}
            inputProps={{ ...register("images") }}
            multiple
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <Box mb={2} display="flex" flexWrap="wrap">
            {images.length > 0 &&
              images.map((image, index) => (
                <Box
                  key={index}
                  position="relative"
                  marginRight={2}
                  marginBottom={2}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product Image ${index}`}
                    style={{
                      maxWidth: "70px",
                      maxHeight: "70px",
                      borderRadius: "4px",
                    }}
                  />
                  <IconButton
                    color="error"
                    size="small"
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "-8px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                    }}
                    onClick={(e) => handleRemoveImage(index, e)}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
          </Box>

          {!loading ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#1877f2",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#166fe5",
                },
              }}
            >
              Post
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              fullWidth
              sx={{
                backgroundColor: "#1877f2",
                color: "#fff",
                fontWeight: "bold",
              }}
              startIcon={<CircularProgress size={24} />}
            >
              Posting...
            </Button>
          )}
        </form>
      )}
    </Box>
  );
};

export default CreatePost;
