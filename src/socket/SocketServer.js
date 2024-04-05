const express = require("express");
const tokenVerify = require("./tokenVerify");
const cors = require("cors");
require("dotenv").config();
const bluebird = require('bluebird');
const redis = require('redis');
const socketAuth = require("socketio-auth");
const adapter = require('socket.io-redis');


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


bluebird.promisifyAll(redis);

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASS,
});


//Authentication
socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { token } = data;

    try {
      const data = tokenVerify(token);
      const canConnect = await client.setAsync(
        `users:${data.decodedToken.email}`,
        socket.id,
        "NX",
        "EX",
        30
      );
      console.log(canConnect+"HIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")

      if (!canConnect) {
        return callback({ message: "ALREADY_LOGGED_IN" });
      }

      socket.email = data.decodedToken.email;

      return callback(null, true);

    } catch (error) {
      console.log(error)
      console.log(`Socket ${socket.id} unauthorized.`);
      return callback({ message: "UNAUTHORIZED" });

    }
  },
  postAuthenticate: (socket) => {
    console.log(`Socket ${socket.id} authenticated.`);

    socket.conn.on('packet', async (packet) => {
      if (socket.auth && packet.type === 'ping') {
        await client.setAsync(`users:${socket.user.id}`, socket.id, 'XX', 'EX', 30);
      }
    })

  },
  disconnect: async(socket) => {
    console.log(`Socket ${socket.id} disconnected.`);

    if (socket.user) {
      await client.delAsync(`users:${socket.email}`);
    }
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Check this
  socket.on("event:send_message", (data) => {
    console.log(data.message);
    console.log(data.to);
    //Send the message to the person
    io.to(data.to).emit("onMessageRec", { message: data.message });
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

(function startServer() {
  try {
    http.listen(PORT, () => {
      console.log(`Http Server along with Socket Server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(
      `Http Server along with Socket Server is not running because ${error.message}`
    );
  }
})()

const redisAdapter = adapter({
  host: process.env.REDIS_HOST ,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASS,
});

io.adapter(redisAdapter);