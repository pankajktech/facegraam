import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Button, Divider, TextField, Tooltip } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../Loading";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import axios from "axios";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { TimeAgo } from "../../Utils/TimeAgo";
import { Context } from "../../Context/Context";
import {
  getLikeDislikeStatus,
  handleLikeDislike,
} from "../../Utils/LikeDislike";

const validationSchema = Yup.object().shape({
  comment: Yup.string()
    .required("Comment is required")
    .min(2, "Comment must be at least 3 characters"),
});

const PostDetail = () => {
  const { user } = useContext(Context);
  const { postid } = useParams();
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState();

  // Form Validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Fetch Post and Comments
  useEffect(() => {
    getPostById();
    getComments();
  }, []);

  useEffect(() => {
    getLikeDislikeStatus({ postid }).then((res) => setLiked(res));
  }, [postid]);

  const handleLikeDislikes = async () => {
    setLiked(!liked);
    post.likes = liked ? post.likes - 1 : post.likes + 1;
    handleLikeDislike({ postid });
  };

  // Fetch Post by ID
  const getPostById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/${postid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setPost(response.data.post);
        setFollowing(response.data.post.follower);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch Comments related to Post
  const getComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get/comment/${postid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Submit Comment
  const handleCommentSubmit = async () => {
    try {
      const newComment = {
        id: comments.length + 1,
        comment: commentText,
        postid: post.postid,
        createdat: new Date().toISOString(),
        createdby: user.userid,
        user: {
          name: user.name,
          profilepic: user.profilepic,
        },
      };

      setComments([newComment, ...comments]);
      console.log(comments);
      toast.success("Comment Added");
      setCommentText("");
      setShowEmojiPicker(false);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/comment`,
        {
          comment: commentText,
          postid: post.postid,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error Commenting post:", error);
      toast.error(
        error.response.data.error ||
        "An error occurred while commenting the post."
      );
    }
  };

  // Follow User
  const handleFollow = async (followid) => {
    try {
      setFollowing(!following);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/follow/${followid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        mb: "50px",
        gap: 2,
        width: { xs: "100%", md: "75%", lg: "25%" },
      }}
    >
      {post.length <= 0 ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "100%",
            bgcolor: "background.default",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Link to={`/user/profile/${post.user.userid}`}>
              <Tooltip title="Visit Profile">
                <Avatar src={post.user.profilepic} alt={""} />
              </Tooltip>
            </Link>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                ml: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {post.user.name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                {TimeAgo(post.postedtime)}
              </Typography>
            </Box>
            {user.userid !== post.createdby ? (
              <Box sx={{ ml: 'auto' }}>
                {following ? (
                  <Button
                    variant="contained"
                    onClick={() => handleFollow(post.user.userid)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#f5f5f5',
                      color: '#333', 
                      '&:hover': {
                        backgroundColor: '#e0e0e0', 
                      },
                      textTransform: 'none', 
                      fontWeight: 'bold', 
                      px: 2, 
                      py: 1,
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => handleFollow(post.user.userid)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'transparent',
                      color: '#2196f3', 
                      borderColor: '#2196f3', 
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                      },
                      textTransform: 'none', 
                      fontWeight: 'bold',
                      px: 2, 
                      py: 1,
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Box>
            ) : null}
          </Box>
          <Box>
            <Typography variant="h6" component="h4" gutterBottom>
              {post.title}
            </Typography>
            {post.images.length > 0 && (
              <Box
                sx={{ display: "flex", flexWrap: "nowrap", overflow: "auto" }}
              >
                <ImageList
                  sx={{
                    flexWrap: "nowrap",
                    transform: "translateZ(0)",
                  }}
                  cols={post.images.length}
                >
                  {post.images.length > 0 &&
                    post.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image.image}
                          alt={image.id}
                          loading="lazy"
                          style={{ cursor: "pointer" }}
                        />
                      </ImageListItem>
                    ))}
                </ImageList>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" mr={2}>
                <IconButton
                  aria-label="like"
                  onClick={() => handleLikeDislikes()}
                >
                  {liked ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography>{post.likes}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton aria-label="comment" sx={{ color: "primary.main" }}>
                <CommentIcon />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(handleCommentSubmit)}>
            <Box mt={2} display="flex" alignItems="center" position="relative">
              <TextField
                id="comment"
                label="Comment"
                multiline
                variant="standard"
                fullWidth
                {...register("comment")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                error={!!errors.comment}
                helperText={errors.comment?.message}
              />
              <IconButton
                aria-label="emoji"
                sx={{ color: "primary.main", ml: 1 }}
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
              <IconButton
                aria-label="comment"
                type="submit"
                sx={{ color: "primary.main", ml: 1 }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </form>

          <Typography variant="h6" component="h4" mt={2}>
            Comments
          </Typography>
          <Divider />

          <Box mt={2}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2,
                }}
                className="animate_in"
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Avatar src={comment.user.profilepic} alt={"profilepic"} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      ml: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {comment.user.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {comment.comment}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {
                    <Typography fontSize={12} variant="subtitle2">
                      {TimeAgo(comment.createdat)}
                    </Typography>
                  }
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PostDetail;
