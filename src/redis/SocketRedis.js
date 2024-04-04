const http = require('http');
const io = require('socket.io')();
const socketAuth = require('socketio-auth');
const adapter = require('socket.io-redis');

const PORT = process.env.PORT || 9000;
const server = http.createServer();

const redisAdapter = adapter({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASS || 'password',
});

io.attach(server);
io.adapter(redisAdapter);
