const mongoose = require('mongoose');
const user_data = require('./userData.model');

var mdb_connect = mongoose.connect('mongodb://localhost/my_database', (error)=>{
    if(!error){
      console.log('Database connection successful!')
    }else{
      console.log("Error connection to database!")
    }
  });

module.exports = mdb_connect;