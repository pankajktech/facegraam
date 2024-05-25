import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Input,
  ImageList,
  ImageListItem,
  Tooltip,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LazyImage from "../LazyImage";
import { handleLikeDislike } from "../../Utils/LikeDislike";
import { TimeAgo } from "../../Utils/TimeAgo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const PostCard = ({ post, setPosts }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [commentPostId, setCommentPostId] = useState(null);

  const handleLikeDislikePost = async (postid) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.postid === postid) {
            const updatedLikeStatus = !post.likedByCurrentUser;
            return {
              ...post,
              likesCount:
                Number(post.likesCount) + (post.likedByCurrentUser ? -1 : 1),
              likedByCurrentUser: updatedLikeStatus,
            };
          }
          return post;
        }),
      );
      await handleLikeDislike({ postid });
    } catch (error) {
      console.error("Error handling like/dislike:", error);
      toast.error("An error occurred while handling like/dislike.");
    }
  };

  const handleCommentSubmit = async (e, postid) => {
    e.preventDefault();
    try {
      toast.success("Comment Added");
      setCommentText("");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postid === postid
            ? { ...post, commentsCount: Number(post.commentsCount) + 1 }
            : post,
        ),
      );
      setCommentPostId(null);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/comment`,
        {
          comment: commentText,
          postid: postid,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Error Commenting post:", error);
      toast.error(
        error.response.data.error ||
          "An error occurred while commenting the post.",
      );
    }
  };

  // Emoji Picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <Box
      key={post.postid}
      className="animate_in"
      sx={{
        bgcolor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <Box display="flex" alignItems="center" p={1.5}>
        <Link to={`/user/profile/${post.createdby}`}>
          <Tooltip title="Visit Profile">
            <Avatar src={post.profilepic} alt={post.name} />
          </Tooltip>
        </Link>
        <Box ml={1}>
          <Typography variant="subtitle2" color="text.primary">
            {post.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {TimeAgo(post.postedtime)}
          </Typography>
        </Box>
        <IconButton
          aria-label="more"
          color="primary"
          sx={{ ml: "auto" }}
          onClick={() => navigate(`/post/${post.postid}`)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Box p={2}>
        <Typography variant="body1" color="text.primary" mb={1}>
          {post.title}
        </Typography>
        <Box mb={2}>
          {post.images.length > 0 && (
            <ImageList
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "4px",
                overflow: "hidden",
              }}
              cols={post.images.length}
              gap={0}
            >
              {post.images.map((image) => (
                <ImageListItem key={image.id}>
                  <LazyImage
                    src={image.image}
                    alt={image.image}
                    width="100%"
                    height="auto"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="like"
              onClick={() => handleLikeDislikePost(post.postid)}
              size="small"
            >
              <Tooltip title="Like">
                {post.likedByCurrentUser ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </Tooltip>
            </IconButton>
            <Typography variant="body2">{post.likesCount}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton
              aria-label="comment"
              onClick={() => setCommentPostId(post.postid)}
              color="primary"
              size="small"
            >
              <Tooltip title="Click to comment">
                <CommentIcon />
              </Tooltip>
            </IconButton>
            <Typography variant="body2">{post.commentsCount}</Typography>
          </Box>
        </Box>
      </Box>
      {commentPostId === post.postid && (
        <form onSubmit={(e) => handleCommentSubmit(e, post.postid)}>
          <Box
            my={1}
            px={1}
            display="flex"
            alignItems="center"
            position="relative"
          >
            <Input
              placeholder="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              required
            />
            <IconButton
              aria-label="emoji"
              color="primary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <EmojiEmotionsIcon />
            </IconButton>
            {showEmojiPicker && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  zIndex: 1,
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    setCommentText(commentText + emoji.native)
                  }
                />
              </Box>
            )}
            <IconButton aria-label="send" color="primary" type="submit">
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default PostCard;
