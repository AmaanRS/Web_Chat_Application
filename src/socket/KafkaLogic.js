const { Kafka } = require("kafkajs");

let _producer = null;
const kafka = new Kafka({
  // clientId: 'my-app',
  brokers: ["127.0.0.1:9092"],
});

async function createProducer() {
    console.log("Using existing producer")
  if (_producer) return _producer;
  const producer = kafka.producer();
  await producer.connect();
  _producer = producer;
  console.log("Using new producer")
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
      console.log(message.value);
    },
  });
}

module.exports = {
    kafka,
    startConsumingMessages,
    produceMessage
}
