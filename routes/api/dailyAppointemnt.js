require('dotenv').config();
const express = require('express');
const router =  express.Router();
const {check , validationResult} = require('express-validator');
const DailyAppo = require('../../model/Dailyappointment')

const authUser = require('../../middleware/authUser'); 
const authDoctor = require('../../middleware/authDoctor');

const User= require("../../model/User"); 
const Doctor = require('../../model/Doctor'); 
const Profile = require('../../model/Profile');
   


//@acesss private 
//@api :http://localhost:5000/api/dailyappointment
router.get('/dailyappointment',authDoctor,async(req,res)=>{ 
    try{ 

      const dailyappo = await DailyAppo.findOne({doctor:req.doctor.id})
         res.json(dailyappo)
    }catch(err){ 
        res.status(400).json(dailyappo)
         console.log(err.message)
    }
})


//@acesss private 
//@api :http://localhost:5000/api/dailyappointment
router.get('/getappointmentno/:doc_id',authUser,async(req,res)=>{ 
    try{ 

      const dailyappo = await DailyAppo.findOne({doctor:req.params.doc_id})
      
         res.json(dailyappo)
    }catch(err){ 
        res.json(dailyappo)
         console.log(err.message)
    }
})


module.exports = router