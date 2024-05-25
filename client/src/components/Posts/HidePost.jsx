import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HidePost = ({ postid, getAllPosts, hidestatus }) => {
  const [open, setOpen] = useState(false);

  const handleHide = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/hide/${postid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        toast.success(response.data.message);
        handleClose();
        getAllPosts();
      }
    } catch (error) { }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton color="error" onClick={handleClickOpen}>
        {hidestatus == 1 ? (
          <Tooltip title="Hide Post">
            <VisibilityOffIcon />
          </Tooltip>
        ) : (
          <Tooltip title="Un-Hide Post">
            <VisibilityIcon />
          </Tooltip>
        )}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Hide Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You sure you want to hide it after that it will not be visible
            to other users
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleHide} autoFocus>
            {hidestatus == 1 ? "Hide" : "Unhide"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HidePost;
