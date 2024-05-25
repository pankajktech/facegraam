import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Google } from "@mui/icons-material";

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  name: yup.string().required(errMess.message),
  username: yup.string().min(3).required(errMess.message),
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup.string().min(6).required(errMess.message),
  bio: yup.string().required(errMess.message),
  profilepic: yup
    .mixed()
    .test("file", "Please upload an Image File", (file) => {
      return file && file.length > 0;
    })
    .test("fileType", "Only images are allowed", (file) => {
      const acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      return file && acceptedTypes.includes(file[0]?.type);
    })
    .test("fileSize", "The file is too large", (file) => {
      return file && file[0]?.size < 5000000;
    }),
});

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    const userData = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      bio: data.bio,
      profilepic: data.profilepic[0],
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.message);
        navigate("/verify", {
          state: { email: data.email, name: data.name },
        });
      }
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = error.response.data.error;
      toast.error(errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  return (
    <Container
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        width: { xs: "100%", sm: "80%" },
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          Register
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}
        >
          <Box sx={{ display: "flex", gap: 2, marginBottom: "16px" }}>
            <TextField
              id="name"
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
            />
            <TextField
              id="username"
              label="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register("username")}
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
            />
          </Box>
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            id="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            type="password"
            {...register("password")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            id="bio"
            label="Bio"
            error={!!errors.bio}
            helperText={errors.bio?.message}
            {...register("bio")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            multiline
            rows={2}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            id="profilepic"
            type="file"
            InputLabelProps={{ shrink: true }}
            accept="image/jpeg, image/png"
            error={!!errors.profilepic}
            helperText={errors.profilepic?.message}
            {...register("profilepic")}
            fullWidth
            variant="outlined"
            size="small"
            margin="normal"
            sx={{ marginBottom: "24px" }}
          />
          {!loading ? (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              Register
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              fullWidth
              startIcon={<CircularProgress size={24} />}
              sx={{
                backgroundColor: "#888",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Registering...
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: "16px", color: "#666", fontWeight: 500 }}
          >
            Already have an account? <Link to="/login" style={{ color: "#333" }}>Login</Link>
          </Typography>
        </form>
        <Box mt={2} width="100%">
          <Button
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
            }}
            variant="outlined"
            fullWidth
            color="primary"
            startIcon={<Google />}
            sx={{
              color: "#333",
              borderColor: "#333",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Register with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
