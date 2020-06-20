const mongoose = require('mongoose');
 

// user schema
const packagesSchema = mongoose.Schema({
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
    setDuration: {
        type: Boolean,
    },
    duration: {
        type: String,
    },
    durationPeriod: {
        type: String,
    },
    createDate: {
        type: String,
        required : true,
    },
    cost : {
        type : Number,
        required :true,
    },
    description : {
        type : String,
    } 
});


// user model 
mongoose.model('packages', packagesSchema);

// exports
module.exports = mongoose.model('packages');