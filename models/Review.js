const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "please a title for the review"],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, "please add a text"]
    },

    rating: {
        type: String,
        required: [true, "Please add a rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'bootcamp',
        required: true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Prevent user from submitting  more than one review
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

module.exports = mongoose.model('Review', ReviewSchema)