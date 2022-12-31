require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var gravtar = require('gravatar');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
 const secretkey = process.env.secretkey
 

 const DailyAppo = require('../../model/Dailyappointment')
 const authUser = require('../../middleware/authUser')
 const User= require("../../model/User"); 
 const Doctor = require('../../model/Doctor'); 
 const Profile = require('../../model/Profile');
const authDoctor = require('../../middleware/authDoctor');

 // @ adding clinc to doctors profile 
 router.post('/add',authDoctor, async (req , res )=>{ 
        const doctorProfile =await Profile.findOne({doctor:req.doctor.id})
         let clinicData = {
            clinicName : req.body.clinicName, 
            location: req.body.location , 
            timing: req.body.timing,
            fees:req.body.fees
         } 
         doctorProfile.clinic.push(clinicData)
        console.log(typeof(doctorProfile))
         await doctorProfile.save();
        res.status(200).json(doctorProfile)
 } )


module.exports = router;