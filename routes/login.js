const express = require('express');
const loginRouter = express.Router();

const passport = require('passport');
const BasicStrategy = require("passport-http").BasicStrategy;
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/users.js');

const SECRET_KEY = 'SECRET_KEY'

async function verify(username, password, done) {

    let user = await users.find(username);
    if (!user) {
        return done(null, false, { message: 'User not found' });
    }

    if (await users.verifyPassword(user, password)) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect password' });
    }
}

passport.use(new BasicStrategy(verify));

// async function find(username) {
//     return await User.findOne({ username }).exec();
// }

// async function verifyPassword (user, password) {
//     return await bcrypt.compare(password, user.passwordHash);
// }

function login(req, res) {
    const { username, password } = req.body;

    const opts = { expiresIn: 600 };
    const token = jwt.sign({ username, password }, SECRET_KEY, opts);

    return res.status(200).json({ message: "Auth Passed", token });
}

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY
}

passport.use(new JwtStrategy(jwtOpts, async (payload, done) => {

    const user = await users.find(payload.username);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'User not found' });
    }

}));

loginRouter.post('/', passport.authenticate('basic', { session: false }), login)

module.exports = login;