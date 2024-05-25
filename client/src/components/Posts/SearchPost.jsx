import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { TimeAgo } from "../../Utils/TimeAgo";

const SearchPost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/posts/search?q=${searchQuery}`,
            {
              withCredentials: true,
            }
          );
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching filtered posts:", error);
        }
        setLoading(false);
      } else {
        setPosts([]);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Search Posts
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {posts.length === 0 && !loading ? (
        <Typography variant="body1">No posts found.</Typography>
      ) : (
        <Stack spacing={2} sx={{ width: "100%" }}>
          {posts.map((post) => (
            <Link
              to={`/post/${post.postid}`}
              key={post.postid}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardHeader
                  avatar={<Avatar src={post.user.profilepic} alt="" />}
                  title={post.user.name}
                  subheader={TimeAgo(post.postedtime)}
                  sx={{ p: 2 }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" component="h4" gutterBottom>
                    {post.title}
                  </Typography>
                </CardContent>
                {post.images.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      p: 2,
                    }}
                  >
                    {post.images.map((image) => (
                      <CardMedia
                        key={image.id}
                        component="img"
                        image={image.image}
                        alt=""
                        sx={{
                          width: {
                            xs: "100%",
                            sm: "150px",
                            md: "200px",
                          },
                          height: {
                            xs: "200px",
                            sm: "150px",
                            md: "200px",
                          },
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default SearchPost;