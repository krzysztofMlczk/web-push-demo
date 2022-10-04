const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  endpoint: String,
  expirationTime: Object, // usually null
  keys: {
    p256dh: String,
    auth: String,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
