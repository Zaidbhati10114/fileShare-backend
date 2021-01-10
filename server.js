// Setting Up Express
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const path = require("path");
app.use(express.static("public"));
app.use(express.json());

// Connection to Db Cloud
const connectDb = require("./config/db");
connectDb();

// Template Engine

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes

app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show")); //To Show Download File

// To Download the Files;

app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
