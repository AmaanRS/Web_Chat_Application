require("dotenv").config();
const PORT = process.env.SOCKET_PORT;
const { SocketLogic } = require("./SocketLogic")
const http = require("http");
const { startConsumingMessages, produceMessage } = require("./KafkaLogic")

async function init() {
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

    await startConsumingMessages()

    // let payload = {
    //   message:"Hiii this is amaan shaikh",
    //   sender:ObjectId("65c6468bb9c60e70e63a1d28"),
    //   receiver:ObjectId("65c64697b9c60e70e63a1d2a")
    // }

    // await produceMessage(JSON.stringify(payload))

  } catch (error) {
    console.log(error)
    console.log(
      `Http Server along with Socket Server is not running`
    );
  }
}

init();