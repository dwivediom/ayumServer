const mongoose = require('mongoose'); //

const DoctorSchema = new mongoose.Schema({ 

 name : { 
    type : String,
    required : true
 }, 
 email : {
    type : String,
    required   : true, 
    }, 
phone : { 
    type : Number,
   
} , 
password : {
  type : String,
  required: true}, 
avtar: { 
    type: String
}, 
date: { 
    type: Date,
    default:Date.now}, 

})
module.exports = Doctor= mongoose.model('doctor', DoctorSchema); 

