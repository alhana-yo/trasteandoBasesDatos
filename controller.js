const express = require("express");
// const repository = require("./repository.js");

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());

// Routes
app.use("/blogEntries", require("./routes/entries"));
app.use("/badwords", require("./routes/badwords"));

module.exports = app;
