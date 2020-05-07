const mongoose = require('mongoose');


// user schema
const userScheman = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    perMobile : Number,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    instName: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
         
    },
    expiryDate: {
        type: String,
        
    },
    demo : {
        type: Boolean,
         
    },
    payment: {
        type: Boolean,
        default: false,
    },
    mobile: {
        type: String,
        required: true,
    },


    password: {
        type: String,
        required: true,
    },
  
    isActive: {
        type: Boolean,
        default: true,

    },
    premium: {
        type: Boolean,
         

    },
    plan: {
        type: String,
        default: 'Demo',

    },
    street : String,

    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },

    createDate: {
        type: Date,
        default: Date.now(),
    },
    logs: [{
        lastLogin : String,
        ip : String,
        location : String,
        browser : String,
    }],
});


// user model 
mongoose.model('users', userScheman);

// exports
module.exports = mongoose.model('users');