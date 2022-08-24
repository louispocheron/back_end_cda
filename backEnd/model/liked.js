const mongoose = require("mongoose");

const  likeSchema = new mongoose.Schema({
    liked_at: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    }, 
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'image'
    }
})

module.exports = mongoose.model('modelLike', likeSchema);