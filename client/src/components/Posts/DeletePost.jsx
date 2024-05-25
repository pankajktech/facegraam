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
import DeleteIcon from "@mui/icons-material/Delete";

const DeletePost = ({ postid, posts, setPosts }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/post/delete/${postid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        toast.success("Post Deleted Successfully");
        handleClose();
        setPosts(posts.filter((post) => post.postid !== postid));
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
      <Tooltip title="Delete Post">
        <IconButton color="error" onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You sure you want to delete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletePost;
