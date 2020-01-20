const User = require('../models/users.js');

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