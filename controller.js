const express = require("express");

const passport = require('passport');

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/blogEntries', require('./routes/entries'));
app.use('/badwords', require('./routes/badwords'));
app.use('/users', require('./routes/users'));

module.exports = app;
