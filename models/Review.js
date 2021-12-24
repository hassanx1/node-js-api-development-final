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

// Prevent user from submitting  more than one review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

// static method to get avg  rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([{
        $match: {
            bootcamp: bootcampId
        }
    },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });

    } catch (err) {
        console.error(err);
    }
};

// call getAverageRatingCost before save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
});

// call getAverageRating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema)