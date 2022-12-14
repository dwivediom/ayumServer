const mongoose = require('mongoose'); //
const Schema = mongoose.Schema;

const DailyappointmentSchema = new mongoose.Schema({ 
    doctor :{ 
        type :  mongoose.Schema.Types.ObjectId, 
        ref: "doctor"
    }, 
    name:{
         type:String , 
    }, 
    clinic:[{
        clinicName:{
            type:String
        }, 
        
        
        location:{ 
            type: String, 
            required: true, 
        }, 
        timing:{ 
            type: String, 
            required: true, 
        }, 
        
        
        fees : { 
            type: String, 
        },
       
        patients:[
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'users'
                  },
                  bookingId: {
                    type: Number
                  },
                  patientname: {
                      type: String,
                      required: true
                  },
                  fathername: {
                    type: String,
                  },
                  status: {
                      type: String,
                  },
                  age: {
                      type: Number,
          
                  },
                  date: {
                    type: Date,
                  },
                  description: {
                      type: String,
                     
                  },
                  name: {
                      type: String
                  },
                  avatar: {
                      type: String
                  },
                  date: {
                      type: Date,
                      default: Date.now
                  },
                  appointmentno:{
                     type:Number
                  }
            }
        ]
    }], 


date: { 
    type: Date,
    default:Date.now}

})
module.exports = Doctor= mongoose.model('Dailyappointment', DailyappointmentSchema); 

