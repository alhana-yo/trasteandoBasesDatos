const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    nickname: String,
    passwordHash: String,
    role: String
}, {
    versionKey: false
});

module.exports = mongoose.model('User', UserSchema);
