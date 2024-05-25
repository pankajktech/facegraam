import { Box, Avatar, Typography, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemAvatar, ListItemText, Chip } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoaderIcon from "../LoaderIcon";
import getFollowList from "../../Utils/getFollowList";
import Loading from "../Loading";
import PostCard from "../Posts/PostCard";
import { toast } from "sonner";

const SeeUserProfile = () => {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState();

  useEffect(() => {
    fetchUser();
    getAllPosts();
    getFollowList(userid).then((response) => {
      setFollowers(response.followers);
      setFollowing(response.following);
      if(response.followers.some(follower => follower.userid === user?.userid)){
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    });
  }, [userid])

  const getAllPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/posts/${userid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPostLoading(false);
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile/${userid}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Follow User
  const handleFollow = async (followid) => {
    try {
      setIsFollowing((prev) => !prev);
      setFollowers((prev) => {
        if (isFollowing) {
          return prev.filter((follower) => follower.userid !== followid);
        } else {
          return [...prev, { follower: { userid: followid } }];
        }
      });
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

  const handleFollowersDialog = () => setShowFollowersDialog((prev) => !prev);
  const handleFollowingDialog = () => setShowFollowingDialog((prev) => !prev);

  if (loading) return <LoaderIcon />;

  return (
    <Grid
      sx={{
        minHeight: "90vh",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mb: 10,
      }}
    >
      <Box
        sx={{
          bgcolor: "#f0f0f0",
          p: 2,
          borderRadius: 2,
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <Avatar
              src={user?.profilepic}
              alt="userimage"
              sx={{ width: "100%", height: "auto", maxWidth: 150, mx: "auto" }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: blue[700] }}>
                {user?.name}
              </Typography>
              {user?.verified === 1 && (
                <VerifiedUserIcon sx={{ color: blue[500], fontSize: "1.5rem", ml: 1 }} />
              )}
            </Box>
           {user.userid !== userid ? (
  <Box sx={{ ml: 'auto' }}>
    {isFollowing ? (
      <Button
        variant="contained"
        onClick={() => handleFollow(userid)}
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
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outlined"
        onClick={() => handleFollow(userid)}
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
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Follow
      </Button>
    )}
  </Box>
) : null}
            <Typography variant="body1" gutterBottom>
              {user?.bio}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                onClick={following.length > 0 ? handleFollowingDialog : undefined}
                label={`${following.length} following`}
              />
              <Chip
                onClick={followers.length > 0 ? handleFollowersDialog : undefined}
                label={`${followers.length} followers`}
                sx={{ mr: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {posts.length === 0 ? (
          postLoading ? <Loading /> : <Typography variant="h6">No posts yet</Typography>
        ) : (
          posts.map((post) => <PostCard key={post.postid} post={post} setPosts={setPosts} />)
        )}
      </Box>



      <Dialog open={showFollowersDialog} onClose={handleFollowersDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Followers</DialogTitle>
        <DialogContent>
          <List>
            {followers.map((follow) => (
              <ListItem
                key={follow.id}
                component={Link}
                to={`/user/profile/${follow.follower.userid}`}
                onClick={handleFollowersDialog}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={follow?.follower.profilepic} alt={follow?.follower?.name} />
                </ListItemAvatar>
                <ListItemText primary={follow?.follower?.name} secondary={`@${follow?.follower?.username}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFollowersDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showFollowingDialog} onClose={handleFollowingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Following</DialogTitle>
        <DialogContent>
          <List>
            {following?.map((follow) => (
              <ListItem
                key={follow.id}
                component={Link}
                to={`/user/profile/${follow.following.userid}`}
                onClick={handleFollowingDialog}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={follow?.following.profilepic} alt={follow?.following?.name} />
                </ListItemAvatar>
                <ListItemText primary={follow?.following?.name} secondary={`@${follow?.following?.username}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFollowingDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default SeeUserProfile;