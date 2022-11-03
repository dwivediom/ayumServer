require('dotenv').config();
const express = require('express');
const router =  express.Router();
const {check , validationResult} = require('express-validator');
const DailyAppo = require('../../model/Dailyappointment')
const authUser = require('../../middleware/authUser')
const User= require("../../model/User"); 
const Doctor = require('../../model/Doctor'); 
const Profile = require('../../model/Profile');

//route :  http://localhost:5000/api/appointment/:doctorid 
router.post("/:doctor_id",[ authUser, 
[
check("patientname", "patient name is required").not().isEmpty(), 
check("age"," age is required").not().isEmpty(), 
  ]


], async(req, res )=> {
       const errors = validationResult(req)
       if(!errors.isEmpty()){ 
        return res.status(400).json({errors : errors.array()})
       }

try{ 
  
    const user = await User.findById(req.user.id).select('-password');
  
    const doctor = await Doctor.findById(req.params.doctor_id).select('-password');
    console.log("doctor:" ,req.params.doctor_id )
    const profile = await Profile.findOne({doctor: req.params.doctor_id})
    let dailyappo = await DailyAppo.findOne({doctor: req.params.doctor_id})
      

     

    // create booking id 
    function appointmentgenrator(){ 
        this.length= 8 ; 
        this.timestamp = +new Date  ; 
        var _getRandom = function(min  , max){
            return Math.floor(Math.random()*(max-min+1))+min;

        }
        this.generate= function(){ 
            var ts = this.timestamp.toString(); 
            var parts = ts.split("").reverse(); 
            var id = ""; 
            for (var i=0; i<this.length ; i++){ 
                var index = _getRandom(0,parts.length-1); 
                id +=parts[index]; 
            }
                return  id ; 
        }
      }
          const create_id = new appointmentgenrator();
           const appointmentId = create_id.generate(); 





           if(dailyappo){

            let dailyPatinet= { 
             bookingId : appointmentId , 
             patientname: req.body.patientname , 
             fathername: req.body.fathername , 
             status: req.body.status , 
             age: req.body.age,
             date: req.body.date, 
             description: req.body.description , 
             avatar: user.avatar ,
             name: user.name ,
             user    : req.user.id ,
             appointmentno: dailyappo.patients.length +1
            }
            dailyappo.patients.push(dailyPatinet); 
            await dailyappo.save()
            
 
           }else{
             let dailyappo = new DailyAppo({ 
               doctor: req.params.doctor_id, 
               name :doctor.name ,  
           
           })
           await dailyappo.save()
           let dailyPatinet= { 
             bookingId : appointmentId , 
             patientname: req.body.patientname , 
             fathername: req.body.fathername , 
             status: req.body.status , 
             age: req.body.age,
             date: req.body.date, 
             description: req.body.description , 
             avatar: user.avatar ,
             name: user.name ,
             user    : req.user.id ,
             appointmentno: dailyappo.patients.length +1
            }
            dailyappo.patients.push(dailyPatinet); 
            await dailyappo.save()
            
 
           }
             


      



           dailyappo = await DailyAppo.findOne({doctor: req.params.doctor_id})




           const newPatinet= { 
            bookingId : appointmentId , 
            patientname: req.body.patientname , 
            fathername: req.body.fathername , 
            status: req.body.status , 
            age: req.body.age,
            date: req.body.date, 
            description: req.body.description , 
            avatar: user.avatar ,
            name: user.name ,
            user    : req.user.id 
           }


           const newAppointment = { 
             bookingId : appointmentId,
             docname:doctor.name,
             doclocation:profile.location,
             patientname:   req.body.patientname ,
             fathername: req.body.fathername ,
             status: req.body.status ,
             age: req.body.age ,
             date: req.body.date ,
             description: req.body.description ,
             avatar: doctor.avatar ,       
             doctor: doctor.id,
             appointmentno: dailyappo.patients.length, 
            
           }

           console.log(profile.location)
           
           
     

    

    profile.patients.push(newPatinet); 
    await  profile.save(); 

    user.appointment.unshift(newAppointment)
    await user.save();
    
 
    //  await DailyAppo.collection.drop();
   
    


    res.json(user)

  } catch (err) { 
    console.log(err.message);
    res.status(500).send("Server error");

  }
  

  }); 

  module.exports = router;