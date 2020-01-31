const express = require('express');
const registerRouter = express.Router();
const addUser = require('../repositories/users.js').addUsers;

registerRouter.post('/', async (req, res) => {

    const { username, nickname, password } = req.body;

    await addUser(username, nickname, password, role = 'publisher');

    console.log('entré en el router', username);

    return res.status(200).json({ message: "user has been successfully registered" });
});

module.exports = registerRouter;