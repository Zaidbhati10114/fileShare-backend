// Database Config

const mongoose = require("mongoose");
const env = require("dotenv").config();

function connectDB() {
  // Database Connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("DB is Connected");
    })
    .catch(err => {
      console.log("Connection Failed");
    });
}

module.exports = connectDB;

// dbPAss:
