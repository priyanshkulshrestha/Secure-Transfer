const mongoose = require('mongoose');

const FILE =new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    orignalName: {
        type: String,
        required: true
    },
    password: String,
    downloadCount: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("Flie", FILE)