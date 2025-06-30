const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  let users = [];
  
  // ✅ Add a user to the users array
  const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId });
      console.log(`✅ User added: ${userId} with socket ID: ${socketId}`);
    }
  };
  
  // ✅ Remove a user from the users array
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    console.log(`❌ User with socket ID: ${socketId} removed`);
  };
  
  // ✅ Get a user by userId
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  // ✅ Handle socket connections
  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);
  
    // Corrected event name (no extra space)
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
        console.log(`📨 Message sent from ${senderId} to ${receiverId}: ${text}`);
      } else {
        console.log(`⚠️ User ${receiverId} not connected.`);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  