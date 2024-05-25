import { Box, Avatar, Typography, Grid, Divider, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { blue, grey } from "@mui/material/colors";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import getFollowList from "../../Utils/getFollowList";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(Context);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);

  useEffect(() => {
    getFollowList(user.userid).then((response) => {
      setFollowers(response.followers);
      setFollowing(response.following);
    });
  }
    , [user.userid]);



  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(null);
        toast.success("Logout successful");
      }
    } catch (error) {
      // handle error
    }
  };

  const handleFollowersDialog = () => setShowFollowersDialog((prev) => !prev);
  const handleFollowingDialog = () => setShowFollowingDialog((prev) => !prev);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "90vh" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 4,
          borderRadius: 2,
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar
              src={user?.profilepic}
              alt={user?.name}
              sx={{ width: 150, height: 150 }}
            />
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" sx={{ fontWeight: "bold", color: blue[700] }}>
                {user?.name}
              </Typography>
              {user.verified === 1 && (
                <VerifiedUserIcon
                  sx={{ color: blue[500], fontSize: "1.5rem", ml: 1 }}
                />
              )}
            </Box>
            <Typography variant="subtitle1">@{user?.username}</Typography>
            <Box sx={{ my: 2, display: "flex", gap: 1 }}>
              <Chip
                onClick={following.length > 0 ? handleFollowingDialog : undefined}
                label={`${following.length} following`} />
              <Chip
                onClick={followers.length > 0 ? handleFollowersDialog : undefined}
                label={`${followers.length} followers`} sx={{ mr: 1 }} />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom sx={{ color: grey[700] }}>
              {user?.email}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" gutterBottom>
              {user?.bio}
            </Typography>
          </Grid>
        </Grid>
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

export default Profile;