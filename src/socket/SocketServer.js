// const express = require("express");
// const tokenVerify = require("./tokenVerify");
// const cors = require("cors");
// const socketAuth = require("socketio-auth");
// const { cookieChecker } = require("../backend/Middlewares/CookieChecker");
// const app = express();

// app.use(cors());

//Create redis client
// const client = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });

//Create a http server 

//Create a io server with hhtp server
// const io = require("socket.io")(http, {
//   cors: {
//     origin: `http://127.0.0.1:${process.env.FRONTEND_PORT}`,
//   },
// });

// //Authentication
// socketAuth(io, {
//   //Runs before first time client gets connected
//   authenticate: async (socket, data, callback) => {
//     //Get the token
//     const { token } = data;

//     try {
//       //Verify it
//       const data = tokenVerify(token);

//       //Set a value in redis
//       await client.set(
//         `users:${data.decodedToken.email}`,
//         socket.id,
//         "NX",
//         "EX",
//         30,
//         (err, result) => {
//           if (err) {
//             console.error("Error occurred while setting value:", err);
//             return callback({ message: "Error occurred while setting value" });
//           }
//           console.log("Value set successfully:", result);
//           if (!result) {
//             return callback({ message: "ALREADY_LOGGED_IN" });
//           }
//           // Value was set successfully and canConnect is true
//           return callback(null, true);
//         }
//       );

//       socket.email = data.decodedToken.email;

//       return callback(null, true);
//     } catch (error) {
//       console.log(error);
//       console.log(`Socket ${socket.id} unauthorized.`);
//       return callback({ message: "UNAUTHORIZED" });
//     }
//   },
//   //Runs after above function
//   postAuthenticate: (socket) => {
//     console.log(`Socket ${socket.id} authenticated.`);

//     //On get a ping from client the changes the expiration of a value in redis to 30sec if it already exists ie it renews connection every 25 secs since websocket pings every 25 secs
//     socket.conn.on("packet", async (packet) => {
//       if (socket.auth && packet.type === "pong") {
//         await client.set(`users:${socket.email}`, socket.id, "XX", "EX", 30);
//       }
//     });
//   },
//   //Runs when socket gets disconnected
//   disconnect: async (socket) => {
//     console.log(`Socket ${socket.id} disconnected.`);

//     //Delete the value from redis
//     if (socket.email) {
//       await client.del(`users:${socket.email}`);
//     }
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);

//   //Check this
//   socket.on("event:send_message", (data) => {
//     console.log(data.message);
//     console.log(data.to);
//     //Send the message to the person
//     io.to(data.to).emit("onMessageRec", { message: data.message });
//   });

//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });

//   app.post("/logout", cookieChecker, async (req, res) => {
//     try {
//       if (!req.middlewareRes.success) {
//         return res.json({
//           message: req.middlewareRes.message,
//           success: req.middlewareRes.success,
//         });
//       }

//       //Email id of user
//       const { decodedToken } = req.middlewareRes;
//       const response = await client.del(`users:${decodedToken.email}`);
//       socket.disconnect();

//       if (!response) {
//         return res.json({
//           message: "The key from redis could ot be deleted",
//           success: false,
//         });
//       }

//       return res.json({
//         message: "The user has logged out successfully",
//         success: true,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.json({
//         message: "Cannot log out from backend",
//         success: false,
//       });
//     }
//   });
// });

require("dotenv").config();
const PORT = process.env.SOCKET_PORT;
const SocketLogic = require("./SocketLogic")
const http = require("http");

function init() {
  try {
    const socketLogic = new SocketLogic();
    const httpServer = http.createServer();

    socketLogic.io.attach(httpServer)

    httpServer.listen(PORT, () => {
      console.log(`Http Server along with Socket Server listening on ${PORT}`);
    });

    socketService.initListeners();

  } catch (error) {
    console.log(
      `Http Server along with Socket Server is not running because ${error.message}`
    );
  }
}

init();
