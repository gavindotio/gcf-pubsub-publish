const { PubSub } = require("@google-cloud/pubsub");

const pubsub = new PubSub({ projectId: "eventstack-prod" });

const pubSubClient = new PubSub();
const topicName = process.env.TOPIC_NAME;

async function publishMessage(message) {
  const dataBuffer = Buffer.from(JSON.stringify(message));

  try {
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
}
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  return publishMessage(req.body).then(() => {
    res.status(200).send(JSON.stringify(req.body));
  });
};

publishMessage({ hello: "world" }).then(() => {
  console.log("done");
});
