const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
        },
    email: {
        type: String,
        required: true,
        max: 255,
        },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    profile_picture: {
        type: String,
        default:'',
        min: 3,
        max: 255
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'modelLike'
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images'
    }]
}, 
    { timestamps: true }
);


module.exports = mongoose.model('user', userSchema);