const socketManager = (io) => {
  io.on("connection", (socket) => {
    
    // Setup the connection
    socket.on("setup", (userData) => {
      try {
        // Join the user to their own room
        socket.join(userData.userid)
      } catch (error) {
        socket.emit("error", "Error setting up the connection");
      }
    });

    // Join a chat room
    socket.on("join-chat", (room) => {
      try {
        socket.join(room);
      } catch (error) {
        socket.emit("error", "Error joining the chat room");
      }
    });

    // Get the messages in a chat room
    socket.on("new-message", (messageData) => {
      try {
        const { senderid, participants } = messageData;
        const recipientId = participants.find((participant) => participant !== senderid);
        socket.to(recipientId).emit("message-received", messageData);
      } catch (error) {
        socket.emit("error", "Error sending the message");
      }
    });

    // Handle the disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketManager;
