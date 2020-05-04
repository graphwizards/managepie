const mongoose = require('mongoose');
const asserts = require('assert');
const db_url = "mongodb://127.0.0.1:27017/managepie";


// connection
mongoose.connect(
  db_url,
  {
      useNewUrlParser : true,
      useUnifiedTopology : true,
      useCreateIndex : true,    
  } , function (error, link) {
        if(error) throw error;
        console.log("database connected");
      
  }
);

