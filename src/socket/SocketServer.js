require("dotenv").config();
const PORT = process.env.SOCKET_PORT;
const SocketLogic = require("./SocketLogic")
const http = require("http");

function init() {
  try {
    const socketLogic = new SocketLogic();

    //Create a http server
    const httpServer = http.createServer();

    //Attach socket server to http server
    socketLogic.io.attach(httpServer)

    httpServer.listen(PORT, () => {
      console.log(`Http Server along with Socket Server listening on ${PORT}`);
    });

    socketLogic.initListeners();

  } catch (error) {
    console.log(error)
    console.log(
      `Http Server along with Socket Server is not running`
    );
  }
}

init();
