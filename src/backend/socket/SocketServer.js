const express = require("express");
const cors = require("cors");
require("dotenv").config()

const app = express();
const PORT = process.env.SOCKET_PORT;

app.use(cors());

//Create a http server using express server
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

//   socket.on("NewUser", (data) => {
//     console.log(data.data);
//   });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

(function startServer(){
  try {
    http.listen(PORT, () => {
      console.log(`Http Server along with Socket Server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(`Http Server along with Socket Server is not running because ${error.message}`);
  }
})()
