const mongoose = require('mongoose');
 

// user schema
const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
 
    },
    durationPeriod: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    isPremium: {
        type: Boolean,
        default : false,
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