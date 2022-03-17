const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    //fk discussion
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "discussion"
    },
    //fk user
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        type: String,
        required: true,
        max: 1000
    },
    vu: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }

);

module.exports = mongoose.model('chat', chatSchema);


