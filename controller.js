const express = require("express");

const passport = require("passport");

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Request-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/blogEntries", require("./routes/entries"));
app.use("/badwords", require("./routes/badwords"));
app.use("/users", require("./routes/users"));

module.exports = app;
