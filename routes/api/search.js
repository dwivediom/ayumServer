require('dotenv').config()
const express = require('express');
const app = express();

const router = express.Router();



const User = require('../../model/User')
const Doctor= require("../../model/Doctor")

const Profile = require('../../model/Profile');

const cors = require('cors')
app.use(cors())


router.get("/search/:key",(req,res)=>{
      const keys = req.params.key; 
      const data = Doctor.aggregate([
        { $lookup:
            {
              from: 'profiles',
              localField: '_id',
              foreignField: 'doctor',
              as: 'searchdata'
            } 
          },
          {$unwind:"$searchdata"},
          {$project:{
            id: 1,
            name: 1,
            phone: 1 , 
            hospital:1,
            city:1,
            clinic:"$searchdata.clinic",
           
            location: "$searchdata.location",
            timing: "$searchdata.timing",
            specialist: '$searchdata.specialist',
            fees: '$searchdata.fees',
          
    
          }},
    
          { $match : {
            "$or":[
                {"specialist":{$regex:keys}},
                {"name":{$regex:keys}},
                {" clinic":{$regex:keys}},
                {"Hospital":{$regex:keys}},
                {"city":{$regex:keys}},
               
              
              
            ]} }
       
    ],function (error, data) {
         console.log(data)    
          res.json(data) 
         
     return (data);
    
    });


})


module.exports= router