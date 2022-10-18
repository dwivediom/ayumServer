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
const authUser= require("../../middleware/authUser")


const User = require('../../modles/User')
const Doctor= require("../../modles/Doctor")

const authDoctor = require('../../middleware/authDoctor');
const Profile = require('../../modles/Profile');



// route for doctor to create currnet profile 
// router : http://localhost:5000/api/profile/me 
//@access private 


router.post('/createprofile', [authDoctor,
[
    check('status', 'Status is requierd ' ).not().isEmpty()
]

]
, async (req, res) => {
      const error= validationResult(req); 
      if(!error.isEmpty()){ 
        return res.status(400).json({error:error.array()});
      }

      const {
            clinic, 
            website,
            location,
            timing, 
            bio, 
            status, 
            specilalists, 
            ruppess, 
            youtube,
            facebook,
            twitter,
            instagram

      }=req.body



// bulid profile object 

const profileFields = {};
profileFields.doctor= req.doctor.id ; 
if(clinic){ profileFields.clinic= clinic} ; 
if(website){ profileFields.website= website} ; 
if(location){ profileFields.location= location} ; 
if(timing){ profileFields.timing= timing} ;
if(bio){ profileFields.bio= bio} ; 
if(status){ profileFields.status= status} ;
if(specilalists){ profileFields.specilalists=specilalists}; 
if(ruppess){ profileFields.ruppess=ruppess} ; 


//buld socil objests 
profileFields.social= {};
if(youtube) profileFields.social.youtube=youtube; 
if(twitter) profileFields.social.twitter=twitter;
if(facebook) profileFields.social.facebook=facebook;                                               
if(instagram) profileFields.social.instagram=instagram;
    try{ 
        let profile= await Profile.findOne({doctor:req.doctor.id}); 
        if(profile){ 
             //update 
             profile= await Profile.findOneAndUpdate(
                {doctor:req.doctor.id},
                {$set: profileFields},
                {new: true}

             );

             return res.json(profile); 

        }

        //create 
        profile = new Profile(profileFields); 
        await profile.save(); 
        res.json(profile);
    }catch(err){ 
        console.log(err.message)
        res.status(400).json("server error")
    }

});



// route for doctor to get currnet profile 
// router : http://localhost:5000/api/profile/me 
//@access private 
router.get('/mee',  authDoctor, async (req, res) => {
        try{ 
            const profile = await Profile.findOne({ doctor: req.doctor.id }).populate('doctor', ['name', 'avatar']);
            if(!profile) {
                return res.status(400).json({ msg: "No Profile for this doctor "});
            }
            res.json(profile)

        }catch(err  ) {
            console.log(err);
            res.status(500).json({ msg: " server Error: " });
        }        
})

/// route to all profile of doctor
// router :: router : http://localhost:5000/api/profile/
router.get("/", async(req,res) => {
    try{
        let profile = await Profile.find().populate("doctor,"["name","avatar"])
        res.json(profile)
    }catch(err){ 
        console.log(err.message)
        res.status(500).json("server error", err.message)
    }
})
// rout api/profile/doctor/:doctor_id            
// des get profile by ddoctor id 
// access public 
router.get("/doctor/:doctor_id", async (req, res) => {
    try{
        const profile = await Profile.findOne({doctor: req.params.doctor_id }).populate("doctor", ["name", "avatar"]); 
        if ( !profile){ 
            return res.status(404).json({ error:"there is no profile available  "}); 


        }
        res.json(profile); 

    }catch (err){ 
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "There is no profile" });
        }
        res.status(500).send('Server error');
    }


        
    
})

// @route   Post api/profile/doctor/:doctor_id
// @desc    Comment on a profile
// @access  Private

router.post('/doctor/:doctor_id',[ authUser,
    [
        check('text', 'Text is required').not().isEmpty()
    ]], 
   async (req, res) => { 
        const error= validationResult(req); 
        if (!error.isEmpty()){ 
            return res.status(400).json({error: error.array()})
        }

        try{ 
            const user = await User.findById(req.user.id).select('-password')
            const profile = await Profile.findOne({ doctor: req.params.doctor_id });

           const newReview = { 
              text : req.body.text ,                                    
              name:    user.name, 
              avatar: user.avatar, 
              user:  req.user.id 
            
           }
           profile.review.unshift(newReview);
        
           await profile.save();
           res.json(profile);
        }catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
})


// @route   Delete api/profile/doctor/:doctor_id/:revieq_id 
// @desc    delete   Comment on a profile
// @access  Private

router.delete("/doctor/:doctor_id/:review_id ",authuser, async(req,res=>{ 

    try{ 
            const profile = await Profile.findOne({doctor: req.params.doctor_id}); 
           
            const review = await profile.review.find(review=> )    
            const text =  await review.text  ; 

            //  make sure review is exist 



    }catch(err) { 
           console.log(err.message)
    }
}))





 
module.exports = router;