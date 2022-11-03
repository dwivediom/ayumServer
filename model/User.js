const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserSchema= new mongoose.Schema({

 name: { 
    type: String, 
    required: true
 }, 
 phone:{
     type:String, 
     required:true 
 },
 email: { 
    type: String, 
    
 }, 
 password: { 
    type: String, 
    required: false},
avatar: { 
    type: String, 
}, 
appointment:[

{
 doctor: { 
    type: Schema.Types.ObjectId, 
    ref: 'doctors'}, 
 docname:{ 
      type:String 
 }   ,
 
bookingid: { 
    type:Number, 
}, 
appointmentno:{
      type:Number, 
},
patientname: { 
    type: String, 
    required: true},

fathername: { 
    type: String, 
} , 

status: { 
    type: String, 
}, 
age: { 
    type: Number, 
} , 
date: {
    type: Date, 
} , 
description: { 
    type: String, 
} , 
name: { 
    type: String, 
}, 
avatar: { 
    type: String, 
} , 
date: { 
    type: Date, 
     default: Date.now, 
},
doclocation:{
    type:String 
} 

}] , 
date: { 
    type: Date, 
     default: Date.now, 
} 


});

module.exports = User= mongoose.model('Users' , UserSchema);
