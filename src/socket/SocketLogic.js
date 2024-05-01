const { Server } = require("socket.io");
const Redis = require("ioredis");
const socketAuth = require("socketio-auth");
require("dotenv").config();
const tokenVerify = require("./tokenVerify");
const userModel = require("../socket/Models/User");
const conversationModel = require("../socket/Models/Conversation");
const mongoose = require("mongoose");

//Create a redis client for publishing
const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

//Create a redis client for subscribing
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

class SocketLogic {
  _io;

  constructor() {
    console.log("Init Socket Logic");

    //Create a socket server
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: `http://127.0.0.1:${process.env.FRONTEND_PORT}`,
      },
    });
  }

  initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners...");

    //Authentication
    socketAuth(io, {
      //Runs before first time client gets connected
      authenticate: async (socket, data, callback) => {
        //Get the token
        const { token } = data;

        try {
          //Verify it
          const data = tokenVerify(token);

          if (!data || !data.success) {
            return callback({
              message: "There is some problem in the token verification",
            });
          }

          //Set a value in redis if it does not exist if it does return null with expiration of 30sec
          await pub.set(
            `users:${data.decodedToken.email}`,
            socket.id,
            "NX",
            "EX",
            30,
            (err, result) => {
              if (err) {
                console.error("Error occurred while setting key in redis", err);
                return callback({
                  message: "Error occurred while setting value in redis",
                });
              }
              console.log("Value set successfully in redis:", result);
              if (!result) {
                return callback({ message: "ALREADY_LOGGED_IN" });
              }
              // Value was set successfully and canConnect is true
              return callback(null, true);
            }
          );

          //Set an property in socket object
          socket.email = data.decodedToken.email;

          //Did not put this into postAuthenticate because for some reason postAuthenticate runs twice
          await mongoose.connect("mongodb://localhost:27017");
          await this.setFriendsInRedisFunc(socket.email);

          //After the Socket is connected take the friends of user from Redis and add the user to each of the rooms created with the names of friends

          //Get all the friends of user from redis and make rooms of their names
          const userFriends = await sub.lrange(
            `friends:${socket.email}`,
            0,
            -1
          );

          //Join all the rooms with room name as friend's name
          for (let index = 0; index < userFriends.length; index++) {
            socket.join(userFriends[index]);
          }

          return callback(null, true);
        } catch (error) {
          console.log(error);
          console.log(`Socket ${socket.id} unauthorized.`);
          return callback({ message: "UNAUTHORIZED" });
        }
      },
      //Runs after authenticate function
      postAuthenticate: async (socket) => {
        console.log(`Socket ${socket.id} authenticated.`);

        //On getting a ping from client this code changes the expiration of a value in redis to 30sec if it already exists; ie it renews connection every 25 secs since websocket pings every 25 secs
        socket.conn.on("packet", async (packet) => {
          if (socket.auth && packet.type === "pong") {
            await pub.set(`users:${socket.email}`, socket.id, "XX", "EX", 30);
          }
        });
      },
      //Runs when socket gets disconnected
      disconnect: async (socket) => {
        console.log(`Socket ${socket.id} disconnectedddd.`);

        //Delete the value from redis on disconnection
        if (socket.email) {
          await this.cleanUserFromRedis(socket.email);
        }
      },
    });

    io.on("connect", async (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);

      // Check this code and write a logic
      socket.on("event:send_message", async (data) => {
        let room;

        //Get the room name from redis
        const friends = await pub.lrange(`friends:${socket.email}`, 0, -1);

        for (let index = 0; index < friends.length; index++) {
          if (friends[index] == `${socket.email}_${data.to}`) {
            room = `${socket.email}_${data.to}`;
            break;
          } else if (friends[index] == `${data.to}_${socket.email}`) {
            room = `${data.to}_${socket.email}`;
            break;
          }
        }
        if (!room) {
          console.log("Could not find the room");
        }

        let payload = {
          sender: socket.email,
          receiver: data.to,
          message: data.message,
        };

        //Save the message to Redis
        const didSaveInRedis = await pub.rpush(
          `conv:${room}`,
          JSON.stringify(payload)
        );

        //Emitted an event to the client that the message has been sent to the intended recipient.
        socket.to(room).emit("event:onMessageRec", payload);
      });

      socket.on("event:logout", async (data) => {
        try {
          //Get the token
          const token = data.token;

          //Get the email from token
          const res = tokenVerify(token);

          if (!res.decodedToken) {
            return console.log("The key from redis could not be deleted");
          }

          await this.cleanUserFromRedis(res.decodedToken.email);

          socket.disconnect();

          console.log("Logout Successfull");
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
  get io() {
    return this._io;
  }

  async cleanUserFromRedis(email) {
    // Check if user's friends are online before deleting certain keys
    //Get the friends of user
    const userFriends = await sub.lrange(`friends:${email}`, 0, -1);

    //Get all the keys in Redis
    const Rediskeys = await pub.keys(`*`);

    //Array for online friends
    let userFriendsOnline = [];

    // Iterate through user's friends
    for (let index = 0; index < userFriends?.length; index++) {
      //UserFriends are in the form of Friend1Email_Friend2Email so split them
      let friend = userFriends[index].split("_");

      //Remove if any of the part is user who is now logging out
      if (friend[0] == email) {
        friend = friend[1];
      } else {
        friend = friend[0];
      }

      // Check if friend's key exists in Rediskeys
      if (
        Rediskeys.includes(`friends:${friend}`) ||
        Rediskeys.includes(`users:${friend}`)
      ) {
        // Friend is online, add to userFriendsOnline array
        userFriendsOnline.push(friend);
      }
    }

    // Delete keys related to offline friends
    for (let key of Rediskeys) {
      // Check if the key is not related to online friends
      if (
        !userFriendsOnline.includes(key.split(":")[1].split("_")[0]) &&
        !userFriendsOnline.includes(key.split(":")[1].split("_")[1])
      ) {
        await pub.del(key);
      }
    }
  }

  //Try adding this in getUserData in controller
  setFriendsInRedisFunc = async (email) => {
    //Take all the conversations from the database and create a list in Redis which has a key of friends:UserEmail and values of FriendEmail1_FriendEmail2

    //Get the id of user
    const userId = (await userModel.findOne({ email: email }))._id;

    if (!userId) {
      return res.json({
        message: "Could not get user id from the database",
        success: false,
      });
    }

    //Get all the conversations which user is a part of ie all the friends of users
    const conversations = await conversationModel.find(
      {
        $or: [{ Friend1: userId }, { Friend2: userId }],
      },
      "Friend1 Friend2"
    );

    console.log("This is conversations");
    console.log(conversations);

    //Add the friends inside redis list
    for (let index = 0; index < conversations.length; index++) {
      const Friend1Email = (
        await userModel.findOne({ _id: conversations[index].Friend1 })
      ).email;

      const Friend2Email = (
        await userModel.findOne({ _id: conversations[index].Friend2 })
      ).email;

      await sub.rpush(`friends:${email}`, `${Friend1Email}_${Friend2Email}`);
    }
  };
}

module.exports = { SocketLogic, pub, sub };
