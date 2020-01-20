const express = require("express");
// const repository = require("./repository.js");

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

// Creo la aplicación express
const app = express();

// const users = require('./usersexample');

// async function verify(username, password, done) {
//     var user = await users.find(username);

//     if (!user) {
//         return done(null, false, { message: 'User not found' });
//     }

//     if (await users.verifyPassword(user, password)) {
//         return done(null, user);
//     } else {
//         return done(null, false, { message: 'Incorrect password' });
//     }
// }


// passport.use(new BasicStrategy(verify));

//Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/blogEntries', require('./routes/entries'));
app.use('/badwords', require('./routes/badwords'));
app.use('/users', require('./routes/users'));

module.exports = app;
