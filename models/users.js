const mongoose = require('mongoose');


// user schema
const userScheman = mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    instName : {
        type : String,
        required : true,
    },
    startDate : {
        type : String,
        default : " ",
    },
    expiryDate : {
        type : String,
        default : " ",
    },
    mobile : {
        type : String,
        required : true,
    },
    
   
    password : {
        type : String,
        required : true,
    },
    payment : {
        type : Boolean,
        default : false,
    },
    isActive: {
        type : Boolean,
        default : true,
         
    },
    address : [{
        city : {
            type : String,
            required : true,
        },
        state : {
            type : String,
            required : true,
        },
        pincode : {
            type : String,
            required : true,
        },
    }],
    createDate : {
        type : Date,
        default : Date.now(),
    },
});


// user model 
mongoose.model('users', userScheman);

// exports
module.exports = mongoose.model('users');