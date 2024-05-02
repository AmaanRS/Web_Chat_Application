const { Kafka } = require("kafkajs");
const conversationModel = require("./Models/Conversation");
const userModel = require("./Models/User");

let _producer = null;
const kafka = new Kafka({
  // clientId: 'my-app',
  brokers: ["127.0.0.1:9092"],
});

async function createProducer() {
  console.log("Using existing producer");
  if (_producer) return _producer;
  const producer = kafka.producer();
  await producer.connect();
  _producer = producer;
  console.log("Using new producer");
  return producer;
}

async function produceMessage(message) {
  console.log("Started producing Messages in Kafka");
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

//Complete this function
async function startConsumingMessages() {
  console.log("Started consuming messsages in Kafka");
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log("New message received");
      console.log(JSON.parse(message.value.toString()));
      let payload = JSON.parse(message.value.toString());
      try {
        //Get the ObjectId of emails and aad to payload
        const senderId = (await userModel.findOne({ email: payload.sender }))
          ._id;

        const receiverId = (
          await userModel.findOne({ email: payload.receiver })
        )._id;

        if (!senderId || !receiverId) {
          console.log("Did not get sender or receiver id");
          return;
        }

        const didUpdate = await conversationModel.updateOne(
          {
            $or: [{ Friend1: senderId }, { Friend1: receiverId }],
          },
          {
            $push: {
              ContentField: {
                message: payload.message,
                sender: senderId,
                receiver: receiverId,
              },
            },
          }
        );
        console.log(didUpdate);
      } catch (error) {
        console.log("Something is wrong in consumer");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

module.exports = {
  kafka,
  startConsumingMessages,
  produceMessage,
};
