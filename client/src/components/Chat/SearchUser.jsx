import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Input,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialLoad = useRef(true);

  useEffect(() => {
    getAllExistingChats();
  }, []);

  const getAllExistingChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get/chatlist`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data.chatList.map(chat => ({ ...chat.otherUser, isExistingChat: true })));
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/search?name=${searchQuery}`,
            { withCredentials: true }
          );
          setUsers([
            ...response.data.users.map(user => ({ ...user, isExistingChat: false })),
            ...users.filter(user => user.isExistingChat),
          ]);
        } catch (error) {
          console.error("Error fetching filtered user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        getAllExistingChats();
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        gap: 2,
        maxWidth: "600px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Search Users
      </Typography>
      <Input
        placeholder="Search for a user..."
        value={searchQuery}
        fullWidth
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {users.length <= 0 ? (
        <Typography variant="body1">No users found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} key={user.userid || user.chatid}>
              <Link
                to={`/chat/user/${user.userid}`}
                state={{
                  recieverid: user.userid,
                  recievername: user.name,
                  recieverprofilepic: user.profilepic,
                }}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <Avatar src={user.profilepic} alt={user.name} />
                  <Typography variant="subtitle1">{user.name}</Typography>
                  {user.isExistingChat && <Typography variant="body2">(Existing Chat)</Typography>}
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchUser;
