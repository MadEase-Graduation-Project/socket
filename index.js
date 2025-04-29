const io = require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:3001",
    },
})
let users =[];
const addUser = (userId,socketId)=>{
    !users.some((user)=>user.userId === userId)&& users.push({userId,socketId})
}
const removeUser = (socketId)=>{
    !users.some((user)=>user.socketId === socketId)&& users.pull({userId,socketId})
}
const getUser = (userId)=>{
 return users.find((user)=>{user.userId === userId})
}
io.on("connection",(socket)=>{
    console.log("a user connected")
   socket.on("addUser",(userId)=>{
    addUser(userId,socket.id);
    io.emit("getUsers",users)
   })
   socket.on("sendMessage",({senderId,receiverId,text})=>{
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage",{
        senderId,
        text,
    })

   })
   socket.on("disconnected",()=>{
    console.log("a user disconneted")
    removeUser(socket.id);
    io.emit("getUsers",users)
   })
})
