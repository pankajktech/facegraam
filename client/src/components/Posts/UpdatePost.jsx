import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { getPostById } from "../../Utils/FetchPostById";

const UpdatePost = () => {
  const { handleSubmit, register, setValue } = useForm();
  const { postid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await getPostById(postid);
      setValue("title", fetchedPost.title);
      setValue("tags", fetchedPost.tags);
      setImages(fetchedPost.images);
    };
    fetchData();
  }, [postid, setValue]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    images.forEach((image) => {
      formData.append("images", image);
    });

    console.log(data.title);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/post/update/${postid}`,
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
        navigate("/all/posts");
      }
    } catch (error) {
      setLoading(false);
      let errorMessage = "Failed to create post";
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
  const handleRemoveImage = (index) => {
    const newImages = images.filter((image, i) => i !== index);
    setImages(newImages);
  };



  return (
    <Container
      sx={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        margin: "auto",
      }}
      maxWidth="xs"
    >
      <form
        name="form"
        style={{
          backgroundColor: "#fff",
          borderRadius: "5px",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Update Post
        </Typography>

        <TextField
          id="title"
          // label="Title"
          fullWidth
          variant="standard"
          margin="normal"
          {...register("title")}
        />

        <TextField
          id="images"
          type="file"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleImageChange}
          inputProps={{ ...register("images") }}
          multiple
        />

        <Box
          mb={2}
          sx={{
            padding: 1,
          }}
        >
          {images.length > 0 &&
            images.map((image, index) => (
              <Box
                key={index}
                display="inline-block"
                position="relative"
                marginRight={3}
              >
                <img
                  src={image.image}
                  alt={`Product Image ${index}`}
                  style={{ maxWidth: "70px", maxHeight: "70px" }}
                />
                <IconButton
                  color="error"
                  size="small"
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            ))}
        </Box>

        {!loading ? (
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Update
          </Button>
        ) : (
          <Button variant="contained" color="primary" disabled fullWidth startIcon={<CircularProgress size={20} />}>
            Updating...
          </Button>
        )}
      </form>
    </Container>
  );
};

export default UpdatePost;
