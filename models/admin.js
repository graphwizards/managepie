const mongoose = require('mongoose');


// user schema
const adminSchema = mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    mobile : {
        type : String,
        required : true,
    },
    
   
    password : {
        type : String,
        required : true,
    },
 
    isActive: {
        type : Boolean,
        default : true,
         
    },
 
    createDate : {
        type : Date,
        default : Date.now(),
    },
    role : {
        type : String,
        default : "admin",
    }
});


// user model 
mongoose.model('admin', adminSchema);

// exports
module.exports = mongoose.model('admin');