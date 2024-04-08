import { Server } from "socket.io";
import Redis from "ioredis";
const socketAuth = require("socketio-auth");
require("dotenv").config();
const tokenVerify = require("./tokenVerify");
const { cookieChecker } = require("../backend/Middlewares/CookieChecker");
const express = require("express");

const app = express();

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

class SocketLogic {
  _io;

  constructor() {
    console.log("Init Socket Logic");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: `http://127.0.0.1:${process.env.FRONTEND_PORT}`,
      },
    });

    //Authentication
    socketAuth(io, {
      //Runs before first time client gets connected
      authenticate: async (socket, data, callback) => {
        //Get the token
        const { token } = data;

        try {
          //Verify it
          const data = tokenVerify(token);

          //Set a value in redis
          await client.set(
            `users:${data.decodedToken.email}`,
            socket.id,
            "NX",
            "EX",
            30,
            (err, result) => {
              if (err) {
                console.error("Error occurred while setting value:", err);
                return callback({
                  message: "Error occurred while setting value",
                });
              }
              console.log("Value set successfully:", result);
              if (!result) {
                return callback({ message: "ALREADY_LOGGED_IN" });
              }
              // Value was set successfully and canConnect is true
              return callback(null, true);
            }
          );

          socket.email = data.decodedToken.email;

          return callback(null, true);
        } catch (error) {
          console.log(error);
          console.log(`Socket ${socket.id} unauthorized.`);
          return callback({ message: "UNAUTHORIZED" });
        }
      },
      //Runs after above function
      postAuthenticate: (socket) => {
        console.log(`Socket ${socket.id} authenticated.`);

        //On get a ping from client the changes the expiration of a value in redis to 30sec if it already exists ie it renews connection every 25 secs since websocket pings every 25 secs
        socket.conn.on("packet", async (packet) => {
          if (socket.auth && packet.type === "pong") {
            await client.set(
              `users:${socket.email}`,
              socket.id,
              "XX",
              "EX",
              30
            );
          }
        });
      },
      //Runs when socket gets disconnected
      disconnect: async (socket) => {
        console.log(`Socket ${socket.id} disconnected.`);

        //Delete the value from redis
        if (socket.email) {
          await client.del(`users:${socket.email}`);
        }
      },
    });

    //Make this dynamic
    sub.subscribe("MESSAGES");
  }

  initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);

      // Check this code and write a logic
      socket.on("event:send_message", async (data) => {
        console.log(data.message);
        console.log(data.to);
        //Send the message to the person
        await pub.publish("MESSAGES", JSON.stringify({ message }));
        io.to(data.to).emit("onMessageRec", { message: data.message });
      });

      // Check this code and write a logic
      sub.on("message", async (channel, message) => {
        if (channel === "MESSAGES") {
          console.log("new message from redis", message);
          io.emit("message", message);
        }
      });

      socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
      });

      app.post("/logout", cookieChecker, async (req, res) => {
        try {
          if (!req.middlewareRes.success) {
            return res.json({
              message: req.middlewareRes.message,
              success: req.middlewareRes.success,
            });
          }

          //Email id of user
          const { decodedToken } = req.middlewareRes;
          const response = await client.del(`users:${decodedToken.email}`);
          socket.disconnect();

          if (!response) {
            return res.json({
              message: "The key from redis could ot be deleted",
              success: false,
            });
          }

          return res.json({
            message: "The user has logged out successfully",
            success: true,
          });
        } catch (error) {
          console.log(error);
          return res.json({
            message: "Cannot log out from backend",
            success: false,
          });
        }
      });
    });
  }
  get io() {
    return this._io;
  }
}

export default SocketLogic;
