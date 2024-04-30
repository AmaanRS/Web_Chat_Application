const { Server } = require("socket.io");
const Redis = require("ioredis");
const socketAuth = require("socketio-auth");
require("dotenv").config();
const tokenVerify = require("./tokenVerify");
const userModel = require("../backend/Models/User")
const conversationModel = require("../backend/Models/Conversation");
const { setFriendsInRedisFunc } = require("../backend/Controllers/Controller");

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

        //After the Socket is connected take the friends of user from Redis and add the user to each of the rooms created with the names of friends

        //Get all the friends of user from redis and make rooms of their names
        const userFriends = await sub.lrange(`friends:${socket.email}`, 0, -1);

        //Join all the rooms with room name as friend's name
        for (let index = 0; index < userFriends.length; index++) {
          socket.join(userFriends[index]);
        }
        console.log(socket.rooms)

        //On getting a ping from client this code changes the expiration of a value in redis to 30sec if it already exists; ie it renews connection every 25 secs since websocket pings every 25 secs
        socket.conn.on("packet", async (packet) => {
          if (socket.auth && packet.type === "pong") {
            await pub.set(`users:${socket.email}`, socket.id, "XX", "EX", 30);
          }
        });
      },
      //Runs when socket gets disconnected
      disconnect: async (socket) => {
        console.log(`Socket ${socket.id} disconnected.`);

        //Delete the value from redis on disconnection
        if (socket.email) {
          await this.cleanUserFromRedis(socket.email)
        }
      },
    });

    io.on("connect", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);

      // Check this code and write a logic
      socket.on("event:send_message", async (data) => {

        let room;
 
        //Get the room name from redis
        const friends = await pub.lrange(`friends:${socket.email}`,0,-1)
        console.log(friends)

        for (let index = 0; index < friends.length; index++) {
            if(friends[index] == `${socket.email}_${data.to}`){
              room = `${socket.email}_${data.to}`
              break;
            }else if(friends[index] == `${data.to}_${socket.email}`){
              room = `${data.to}_${socket.email}`
              break;
            }
        }
        if(!room){
          console.log("Could not find the room")
        }

        // This loic is wrong and cannot be changed by using small fixes so i am changing the conversation naming convention 
        let payload = {
          sender:"Self",receiver:"Friend",message:data.message
        }

        //Save the message to Redis
        const didSaveInRedis = await pub.rpush(`conv:${room}`,JSON.stringify(payload))

        
        //Emitted an event to the client that the message has been sent to the intended recipient.
        socket.to(room).emit("event:onMessageRec", { message: data.message });
      });

      socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
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

          await this.cleanUserFromRedis(res.decodedToken.email)

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
    //Delete the key from redis using the email
    // await pub.del(`users:${email}`);

    //This is an inefficient approach if possible please change this later
    //Reason for inefficiency -> When one user logs out the keys related to him will get deleted so if his friend is also online he will have to fetch the data from database again rather than from redis
    //Deleting all the user related keys in Redis
    const Rediskeys = await pub.keys(`*:*${email}*`);
    // console.log(Rediskeys);
    var pipeline = pub.pipeline();
    Rediskeys.forEach(function (key) {
      //Uncomment this in future
      // pipeline.del(key);
    });
    pipeline.exec();
  }
}

module.exports = { SocketLogic, pub, sub };
