require("dotenv").config();
const express = require("express");
const basicAuth = require("express-basic-auth");
const webpush = require("web-push");
const bodyparser = require("body-parser");
const { Subscription, connectToMongoDB } = require("./database");

const vapidDetails = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
  subject: process.env.VAPID_SUBJECT,
};

function sendNotification(subscriptions, title, body, url) {
  // Create the notification content.
  const notification = JSON.stringify({
    title: title || "Hello, Notifications",
    options: {
      body: body || `ID: ${Math.floor(Math.random() * 100)}`,
      url: url || null,
    },
  });
  // Customize how the push service should attempt to deliver the push message.
  // And provide authentication information.
  const options = {
    TTL: 10000,
    vapidDetails: vapidDetails,
  };
  // Send a push message to each client specified in the subscriptions array.
  subscriptions.forEach((subscription) => {
    const endpoint = subscription.endpoint;
    const id = endpoint.substr(endpoint.length - 8, endpoint.length);
    webpush
      .sendNotification(subscription, notification, options)
      .then((result) => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Result: ${result.statusCode}`);
      })
      .catch((error) => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Error: ${error} `);
      });
  });
}

const app = express();
app.use(bodyparser.json());
app.use(express.static("public"));

// CLIENT ---------
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/add-subscription", async (request, response) => {
  console.log(`Subscribing ${request.body.endpoint}`);
  try {
    // add subscription document to the mongodb
    await new Subscription(request.body).save();
    response.sendStatus(200);
  } catch (err) {
    console.error(err);
    response.sendStatus(507);
  }
});

app.post("/remove-subscription", async (request, response) => {
  console.log(`Unsubscribing ${request.body.endpoint}`);
  try {
    // remove subscription document from mongodb
    await Subscription.deleteOne({
      endpoint: request.body.endpoint,
    });
    response.sendStatus(200);
  } catch (err) {
    console.error(err);
    response.sendStatus(507);
  }
});

// ADMIN ---------
app.get(
  "/admin",
  basicAuth({
    users: { [`${process.env.ADMIN_LOGIN}`]: `${process.env.ADMIN_PASSWORD}` },
    challenge: true,
  }),
  (request, response) => {
    response.sendFile(__dirname + "/views/admin.html");
  }
);

app.post(
  "/notify-all",
  basicAuth({
    users: { [`${process.env.ADMIN_LOGIN}`]: `${process.env.ADMIN_PASSWORD}` },
    challenge: true,
  }),
  async (request, response) => {
    console.log("Notifying all subscribers");
    const { title, body, url } = request.body;
    try {
      // find all subscription documents
      const subscriptions = await Subscription.find();
      if (subscriptions.length > 0) {
        sendNotification(subscriptions, title, body, url);
        response.sendStatus(200);
      } else {
        response.sendStatus(409);
      }
    } catch (err) {
      console.error(err);
      response.sendStatus(507);
    }
  }
);

// Run the server
const listener = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${listener.address().port}`);
  connectToMongoDB();
});
