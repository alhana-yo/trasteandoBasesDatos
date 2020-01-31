const User = require('../models/users.js');
const bcrypt = require('bcrypt');

const defAdmins = require('../utils/load_admins.js');


const createSampleAdmins = async function () {
    defAdmins.forEach(async user => {
        await addUsers(user.username, user.nickname, user.password, user.role);
    })
}
const addUsers = async function (username, nickname, password, role) {
    let passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(8), null);

    let user = await User.findOne({ username }).exec();
    console.log('user de users repo: ', user);

    if (!user) {
        user = new User({ username, nickname, passwordHash, role });

    } else {
        user.passwordHash = passwordHash;
    }

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

module.exports = {
    createSampleAdmins,
    addUsers
}
