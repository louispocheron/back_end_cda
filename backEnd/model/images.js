
// A FAIRE : REGARDER OU STOCKER LES IMAGES DANS MONGODB !!
// STOCKER LES IMAGES DANS LE BACK END

const mongoose = require('mongoose');
const commentaires = require('./commentaire');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 10000
    },
    description: {
        type: String,
        required: false,
        min: 3,
        max: 1000
    },
    // like: {
    //     type: number,
    //     required: true,
    //     min: 0,
    //     default: 0,
    // },
    posted_at: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'likes'
    }],
    commentaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentaire'
    }]
});

module.exports = mongoose.model('images', imageSchema);