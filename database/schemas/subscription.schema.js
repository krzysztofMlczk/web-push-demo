const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  endpoint: String,
  expirationTime: Object, // usually null
  // Eliptic-curve Diffie Hellman keys for push message encryption - see: https://datatracker.ietf.org/doc/html/draft-ietf-webpush-encryption
  keys: {
    // public key
    // NOTE: when browser creates PushSubscription it saves
    // corresponding private key, so it can decrypt the
    // message when it arrives from the (potentially insecure) PushService
    p256dh: String,
    // shared secret
    auth: String,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
