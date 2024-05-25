import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  ImageList,
  ImageListItem,
  Tooltip,
  Button,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import Loading from "../Loading";
import DeletePost from "./DeletePost";
import HidePost from "./HidePost";
import CommentIcon from "@mui/icons-material/Comment";
import { TimeAgo } from "../../Utils/TimeAgo";
import LazyImage from "../LazyImage";
import { useContext } from "react";
import { Context } from "../../Context/Context";

const UserPosts = () => {
  const {user} = useContext(Context)
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    setIsLoading(true);
    try {
      if(user.userid){
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/posts/${user.userid}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setPosts(response.data.posts);
        setIsLoading(false);
      }
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 2,
        maxWidth: "400px",
        mx: "auto",
        marginBottom: 5,
      }}
    >
      {isLoading ? (
        <Loading />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Box
            className="animate_in"
            key={post.postid}
            sx={{
              width: "100%",
              maxWidth: "600px",
              bgcolor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              padding: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Avatar src={post.profilepic} alt={post.name} />
              <Box sx={{ marginLeft: 1 }}>
                <Typography variant="subtitle1">{post.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {TimeAgo(post.postedtime)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              {post.title}
            </Typography>
            {post.images.length > 0 && (
              <ImageList
                sx={{ marginBottom: 2 }}
                cols={post.images.length}
                rowHeight={200}
              >
                {post.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <LazyImage
                      src={image.image}
                      alt={`Image ${index}`}
                      height="100%"
                      width="100%"
                      style={{ cursor: "pointer", objectFit: "cover" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton aria-label="like">
                  <FavoriteIcon />
                </IconButton>
                <Typography>{post.likesCount}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton aria-label="comment" sx={{ color: "primary.main" }}>
                  <CommentIcon />
                </IconButton>
                <Typography>{post.commentsCount}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                backgroundColor: "#E1f7ff",
              }}
            >
              <Link to={`/post/update/${post.postid}`}>
                <Tooltip title="Edit Post">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <DeletePost postid={post.postid} posts={posts}
                setPosts={setPosts} />
              <HidePost
                postid={post.postid}
                hidestatus={post.showpost}
                getAllPosts={getAllPosts}
                
              />
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body1">You Don't Have Any Post</Typography>
          <Link to="/all/posts">
            <Button variant="outlined">Add One</Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default UserPosts;
