const express = require("express");
// const repository = require("./repository.js");

const passport = require('passport');

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/blogEntries', require('./routes/entries'));
app.use('/badwords', require('./routes/badwords'));
app.use('/users', require('./routes/users'));

module.exports = app;
