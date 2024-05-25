import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import { Google } from "@mui/icons-material";

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup.string().min(6).required(errMess.message),
});

const Login = () => {
  const { user, setUser, loading: loadingPro, getProfile } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!loadingPro && user?.email) {
      navigate("/all/posts");
    }
  }, [loadingPro, user, navigate]);


  const handleFormSubmit = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        userData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        getProfile();
        setLoading(false);
        toast.success("Logged in successfully");
        navigate("/all/posts");
      }
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  return (
    <Container
      sx={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
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
          Login
        </Typography>
        <form
          name="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ width: "100%" }}
        >
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
            fullWidth
            variant="outlined"
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
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              startIcon={<CircularProgress size={24} />}
              fullWidth
              sx={{
                backgroundColor: "#888",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Logging in...
            </Button>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: "16px", color: "#666", fontWeight: 500 }}
          >
            Don't have an account? <Link to="/register" style={{ color: "#333" }}>Register</Link>
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
            Login with Google
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
