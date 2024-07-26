const socketMiddleware = require("../utlis/socketMiddleware.js");
const { setUserOnline, setUserOffline, getOnlineReceipt, insertChat } = require("./socketFunctions.js");

const socketServer = (io) => {
  io.use(socketMiddleware);

  io.on("connection", (socket) => {
    console.log("new connection")
    socket.on("connected", async (data) => {
      await setUserOnline({userId:data?.userId, socketId:socket.id});
    });

    socket.on("send-message", async (data) => {
      await insertChat(data);
      
      let receipt = await getOnlineReceipt({userId:data?.to});

      if(receipt){
        io.to(receipt.socketId).emit("new-message", data);
      }

    });

    socket.on("disconnect", async() => {
      await setUserOffline({socketId:socket.id});
    });
    
  });
};

module.exports = socketServer;
