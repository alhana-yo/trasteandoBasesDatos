const mongoose = require('mongoose');
const { Schema } = mongoose;

const BadWordSchema = new Schema({
    badword: String,
    level: Number
}, {
    versionKey: false
});

module.exports = mongoose.model("BadWord", BadWordSchema);