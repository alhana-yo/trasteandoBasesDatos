const User = require('../models/users.js');
const bcrypt = require('bcrypt');

exports.createSampleAdmins = async function () {
    await addUser('beatriz', 'bea', 'pass1', 'admin');
    await addUser('katherine', 'kath', 'pass2', 'admin');
    await addUser('ada', 'ada-lovelace', 'pass3', 'admin');
}

//Registrar nuevo usuario
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

//LOGIN 
exports.find = async function (username) {
    return await User.findOne({ username }).exec();
}

exports.verifyPassword = async function (user, password) {
    return await bcrypt.compare(password, user.passwordHash);
}

//Blog user methods
exports.findAllusers = async function () {
    const users = await User.find();
    return users;
};

exports.findOneUser = async function (id) {
    const user = await User.findById(id);
    return user;
};

exports.postOneUser = async function (user) {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
};
