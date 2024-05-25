import React, { useContext, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import LazyImage from "./LazyImage";
import LoaderIcon from "./LoaderIcon";


const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(Context);

  useEffect(() => {
    if (!loading && user?.email) {
      navigate("/all/posts");
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <LoaderIcon />
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 4 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            pr: { md: 8 },
            mb: { xs: 6, md: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              background: "linear-gradient(to right, #2196f3, #3f51b5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Face<span style={{ color: "#333" }}>Gram</span>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "#616161",
              lineHeight: 1.5,
              maxWidth: "500px",
              textAlign: "justify",
            }}
          >
            Capture and share life's special moments with friends and family in a beautiful and modern way.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2196f3",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0d47a1",
                },
              }}
            >
              Log In
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ fontWeight: "bold" }}
            >
              Register
            </Button>
          </Box>
          <Typography
            variant="body2"
            color="#616161"
            sx={{ lineHeight: 1.5 }}
          >
            Already have an account?{" "}
            <span
              style={{
                cursor: "pointer",
                color: "#2196f3",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 3, md: 0 },
          }}
        >
          <LazyImage
            src="/facegram.png"
            alt="FaceGram"
            aspectRatio="1:1"
            height="350px"
            width="350px"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;