const mongoose = require('mongoose');
 

// user schema
const coursesSchema = mongoose.Schema({
    userID :{
        type : String,
        required  : true,

    },
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,

    },
    createDate: {
        type: String,
        required : true,
    },
    description : {
        type : String,
    },
    subjects : [{
        name : {
            type : String,
            required : true,
        },
        createDate: {
            type: String,
             required : true,
        },
        description : {
            type : String,
        },
        isActive: {
            type: Boolean,
            default: true,
    
        },
        notes : [{
            name : String,
            date : String,
            file : String,
        }]
    }]
});


// user model 
mongoose.model('courses', coursesSchema);

// exports
module.exports = mongoose.model('courses');