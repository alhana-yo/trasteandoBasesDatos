const express = require('express');
const registerRouter = express.Router();
const addUser = require('../repositories/users.js').addUsers;

const User = require('../models/users.js');

registerRouter.post('/', async (req, res) => {

    const { username, nickname, password } = req.body;

    const user = await User.findOne({ username }).exec();

    if (user === null) {
        await addUser(username, nickname, password, role = 'publisher');
        return res.status(200).json({ message: "user has been successfully registered" });
    } else {
        return res.status(200).json({ message: "user already exists" });
    }
});

module.exports = registerRouter;