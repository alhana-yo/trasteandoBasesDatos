const express = require("express");
// const repository = require("./repository.js");

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  next();
});
// Routes
app.use("/blogEntries", require("./routes/entries"));
app.use("/badwords", require("./routes/badwords"));
app.use("/users", require("./routes/users"));

module.exports = app;
