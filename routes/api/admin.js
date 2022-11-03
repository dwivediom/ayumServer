require('dotenv').config();
const express = require('express');
const router =  express.Router();
const {check , validationResult} = require('express-validator');
const DailyAppo = require('../../model/Dailyappointment')
const authUser = require('../../middleware/authUser')
const User= require("../../model/User"); 
const Doctor = require('../../model/Doctor'); 
const Profile = require('../../model/Profile');
const time = 1000*60*60*24

router.get("/start27" , async (req,res)=>{
    const dailyappo = await DailyAppo.findOne(); 
    
      try{
      setInterval(async() => {
        console.log("working")
        
        console.log(dailyappo)
         if(dailyappo){
            await DailyAppo.collection.drop();
         }
      }, time);
      res.json({msg:'condown started '})
    }catch(err){ 
        console.log(err.message)
    }


})














module.exports = router;