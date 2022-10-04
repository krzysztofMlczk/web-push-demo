const connectToMongoDB = require("./mongoDB");
const Subscription = require("./schemas/subscription.schema");

module.exports = {
  connectToMongoDB,
  Subscription,
};
