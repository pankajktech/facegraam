import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Typography,
  TextField,
  Paper,
  Avatar,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { io } from "socket.io-client";
import { Context } from "../../Context/Context";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { TimeAgo } from "../../Utils/TimeAgo";
import { getAllMessages } from "../../Utils/ChatUtils";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

let socket = io(import.meta.env.VITE_API_URL);

const ChatWithUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [message, setMessage] = useState("");
  const [chatid, setChatid] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { recieverid, recievername, recieverprofilepic } = location.state;

  useEffect(() => {
    if (user.userid && recieverid) {
      createChat();

      if (user.name) {
        socket.emit("setup", {
          userid: user.userid,
          name: user.name,
        });

        socket.on("message-received", (newMessageReceived) => {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        });

        return () => {
          socket.on("disconnect");
        };
      }
    }
  }, [user.userid, recieverid]);

  const createChat = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create/chat`,
        {
          recieverid: recieverid,
        },
        {
          withCredentials: true,
        }
      );

      setChatid(response.data.chatid);
      socket.emit("join-chat", response.data.chatid);

      const messages = await getAllMessages(response.data.chatid);
      setMessages(messages);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/chat");
    }
  };

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        senderid: user.userid,
        content: message,
        createdat: new Date().toISOString(),
        messageid: Math.random(),
        participants: [user.userid, recieverid].sort(),
      };

      setMessage("");
      setShowEmojiPicker(false);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("new-message", newMessage);

      if (user.userid) {
        const serverMessage = {
          chatid: chatid,
          senderid: user.userid,
          content: message,
        };

        axios
          .post(
            `${import.meta.env.VITE_API_URL}/api/send/message`,
            serverMessage,
            {
              withCredentials: true,
            }
          )
          .catch((error) => {
            console.error("Error sending message to the server:", error);
            toast.error("Failed to send message.");
          });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };
  const handleEmojiSelect = (emojiObject) => {
    setMessage(message + emojiObject.native);
  };

  //Scroll to bottom of chat
  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      maxWidth="sm"
      sx={{
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 130px)",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        sx={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 1,
          gap: 1,
        }}
        position="static"
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={() => navigate("/chat")}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          alt="User Avatar"
          src={recieverprofilepic}
          sx={{ marginRight: 2 }}
        />
        <Typography variant="h6" component="div">
          {recievername}
        </Typography>
      </Paper>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          px: 2,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ margin: "auto" }} />
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <Box
              className="animate_in"
              key={index}
              sx={{
                marginBottom: 1,
                maxWidth: "80%",
                alignSelf:
                  message?.senderid === user?.userid
                    ? "flex-end"
                    : "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Paper
                sx={{
                  padding: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(5px)",
                  textAlign: "center",
                }}
              >
                <Typography>{message.content}</Typography>
              </Paper>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  marginTop: 0.5,
                }}
              >
                {TimeAgo(message.createdat)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              color: "gray",
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            No messages yet
          </Typography>
        )}
        <div ref={messageEndRef} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: 2,
          width: "100%",
          padding: 1,
          position: "relative",
        }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          required={true}
          fullWidth
          sx={{
            borderRadius: "100px",
            backdropFilter: "blur(10px)",
          }}
          InputProps={{
            endAdornment: (
              <>
                <IconButton
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  sx={{ padding: 0, marginRight: 2 }}
                >
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton
                  onClick={handleSendMessage}
                  sx={{ padding: 0 }}
                  color="success"
                  disabled={message.length === 0}
                >
                  <SendIcon />
                </IconButton>
              </>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        {showEmojiPicker && (
          <Box
            sx={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              zIndex: 1,
            }}
          >
            <EmojiPicker data={data} onEmojiSelect={handleEmojiSelect} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWithUser;
