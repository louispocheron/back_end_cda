const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
    commentaire: {
        type: String,
        required: true,
        max: 1000
    },
    posted_at: {
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
});     

module.exports = mongoose.model('commentaire', commentaireSchema);