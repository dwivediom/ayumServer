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
    required: true},
avatar: { 
    type: String, 
}, 
appointment:[

{
 doctor: { 
    type: Schema.Types.ObjectId, 
    ref: 'doctors'}, 
 
bookingid: { 
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
discription: { 
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
} 

}] , 
date: { 
    type: Date, 
     default: Date.now, 
} 


});

module.exports = User= mongoose.model('Users' , UserSchema);
