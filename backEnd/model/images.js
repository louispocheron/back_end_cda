
// A FAIRE : REGARDER OU STOCKER LES IMAGES DANS MONGODB !!
// STOCKER LES IMAGES DANS LE BACK END

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 10000
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 1000
    },
    posted_at: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

});

module.exports = mongoose.model('images', imageSchema);