require('dotenv').config();
const express = require('express');
const router =  express.Router();
const {check , validationResult} = require('express-validator');

const authUser = require('../../middleware/authUser')
const User= require("../../modles/User"); 
const Doctor = require('../../modles/Doctor'); 
const Profile = require('../../modles/Profile');

//route :  http://localhost:5000/api/appointment/:doctor_id 
router.post("/:doctor_id",[ authUser, 
[
check("name", "patient name is required").not().isEmpty(), 
check("age"," age is required").not().isEmpty(), 
check("discription"," description is required").not().isEmpty()]


], async(req, res )=> {
       const errors = validationResult(req)
       if(!errors.isEmpty()){ 
        return res.status(400).json({errors : errors.array()})
       }

try{ 
   
    const user = await User.findById(req.user.id).select('-password');
    const doctor = await Doctor.findById(req.params.doctor_id).select('-password');
    const profile = await Profile.findById({doctor: req.params.doctor_id})


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
              
          const create_id = new appointmentgenrator();
           const appointmentId = create_id.generate(); 


           const newPatinet= { 
            bookingId : appointmentId , 
            patientname: req.body.patientname , 
            fathername: req.body.fathername , 
            status: req.body.status , 
            age: req.body.age,
            date: req.body.date, 
            discription: req.body.discription , 
            avatar: user.avatar ,
            name: user.name ,
            user    : req.user.id 
           }


           const newAppointment = { 
             bookingId : appointmentId,
             patientname:   req.body.patientname ,
             fathername: req.body.fathername ,
             status: req.body.status ,
             age: req.body.age ,
             date: req.body.date ,
             discription: req.body.discription ,
             avatar: doctor.avatar ,
             name: doctor.name ,             
             doctor: doctor.id
           }

            
    }
    profile.patient.unshift(newPatinet); 
    await  profile.save(); 

    user.appointment.unshift(newAppointment)
    await user.save();

    res.json(user)

  } catch (err) { 
    console.log(err.message);
    res.status(500).send("Server error");

  }
  

  }); 

  module.exports = router;