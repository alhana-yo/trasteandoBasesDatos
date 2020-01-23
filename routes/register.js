const express = require('express');
const registerRouter = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/users')


async function addUser(username, nickname, password, role) {
    //generación de clave encriptada
    var passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(8), null);

    //busco el username en la BBDD
    var user = await User.findOne({ username }).exec();

    //si no está registrado, creo un nuevo usuario
    if (!user) {
        user = new User({ username, nickname, passwordHash, role });
        // le asigno el passwordHash que corresponde a la clave introducida
    } else {
        user.passwordHash = passwordHash;
    }

    //Guardo el nuevo usuario en la BBDD
    await user.save();
}

registerRouter.post('/', async (req, res) => {

    const { username, nickname, password } = req.body;

    await addUser(username, nickname, password, role = 'publisher');

    return res.status(200).json({ message: "registro funciona" });
});

module.exports = registerRouter;