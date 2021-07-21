const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        // dropDups: true,
        trim: true,
        maxlength: [50, "Name can only be 50 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description can only be 500 characters"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Plhone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please enter a valid email']
    },
    location: {
        // GeoJSON point
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '@dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must morethan 1'],
        max: [10, 'Rating can not be morethan 10'],
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssitanceg: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },

    acceptGit: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);