require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

module.exports = connectToMongoDB;
