const mongoose = require('mongoose'); //

const DoctorSchema = new mongoose.Schema({ 

 name : { 
    type : String,
    required : true
 }, 
 email : {
    type : String,
    
    }, 
phone : { 
    type : Number,
   required   : true, 
} , 
password : {
  type : String,
  required: true}, 
avtar: { 
    type: String
}, 
hospital: { 
       type: String, 
       default : 'private doctor'

},
city:{
 type:String , 
 required : true 
},
date: { 
    type: Date,
    default:Date.now}, 

})
module.exports = Doctor= mongoose.model('doctor', DoctorSchema); 

