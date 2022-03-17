const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    //fk user
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    });

    module.exports = mongoose.model('discussion', discussionSchema);