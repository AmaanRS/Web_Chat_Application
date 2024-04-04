const express = require("express");
const tokenVerify = require("./tokenVerify")
const cors = require("cors");
require("dotenv").config()
const socketAuth = require('socketio-auth');


const app = express();
const PORT = process.env.SOCKET_PORT;

app.use(cors());

//Create a http server using express server
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: `http://127.0.0.1:${process.env.FRONTEND_PORT}`,
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Check this
  socket.on("event:send_message", (data) => {
    console.log(data.message);
    console.log(data.to);
    //Send the message to the person
    io.to(data.to).emit("onMessageRec",{message:data.message})
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});




//Authentication
socketAuth(io,{
  authenticate: async(socket,data,callback)=>{
    const { token } = data;

    try {
      const data = tokenVerify(token)

      socket.email = data.email

      return callback(null, true);
    } catch (error) {
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: 'UNAUTHORIZED' });
    }
  },
  postAuthenticate: (socket) => {
    console.log(`Socket ${socket.id} authenticated.`);
  },
  disconnect: (socket) => {
    console.log(`Socket ${socket.id} disconnected.`);
  }
})


(function startServer(){
  try {
    http.listen(PORT, () => {
      console.log(`Http Server along with Socket Server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(`Http Server along with Socket Server is not running because ${error.message}`);
  }
})()
