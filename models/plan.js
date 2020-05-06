const mongoose = require('mongoose');


// user schema
const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
        unique: true,
    },
    cost: {
        type: String,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,

    },
    createDate: {
        type: Date,
        default: Date.now(),
    },
});


// user model 
mongoose.model('plans', planSchema);

// exports
module.exports = mongoose.model('plans');