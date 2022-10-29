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


const User = require('../../model/User')
const Doctor= require("../../model/Doctor")

const authDoctor = require('../../middleware/authDoctor');
const Profile = require('../../model/Profile');



// route for doctor to create currnet profile 
// router : http://localhost:5000/api/profile/me 
//@access private 


router.post('/createprofile', [authDoctor,
[
    // check('status', 'Status is requierd ' ).not().isEmpty()
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
            specialist, 
            fees, 
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
if(specialist){ profileFields.specialist=specialist}; 
if(fees){ profileFields.fees=fees} ; 


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
        res.status(400).json({error:err.message})
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

/// route to all profile of doctor all user can see 
// router :: router : http://localhost:5000/api/profile/
router.get("/", async(req,res) => {
    try{
        let profile = await Profile.find().populate("doctor",["name","avatar","email", "phone"])
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
// need to check the api is not  working 

router.delete('/doctor/:doctor_id/:review_id', authUser, async (req, res) => {
    try {
        const profile = await Profile.findOne({ doctor: req.params.doctor_id });

        // Pill out review
        const review = profile.review.find(review => review.id === req.params.review_id);
        
        const text = review.text;
        
        // Make sure review exists
        if(!review) {
            return res.status(404).json({ msg: "Review not exist "});
        }
        // Check user
        if(review.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: "User not autherized" });
        }
       
        // get remove index
        const removeIndex = profile.review.map( review => review.text).indexOf(text);
        
        profile.review.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @Delete  api/profile 
// Delete profile   of doctor 
// @access priavate 

router.delete('/', authDoctor, async(req, res)=>{ 
    try { 
        //Remove profile 
        await Profile.findOneAndRemove({doctor:req.doctor.id})
        //Remove doctor 
        await Doctor.findOneAndRemove({_id: req.doctor.id}); 
        res.json({msg:"Doctor deleted "})

    }catch(err){ 
         console.log(err.message); 
         res.status(500).send('Server error'); 
    }
});





// @route   Put api/profile/experience
// @desc    Add profile, experience 
// @access  Private
router.put('/experience', [authDoctor,
    [
        check('position', 'Position is required')
            .not()
            .isEmpty(),
        check('medical', 'Medical is required')
            .not()
            .isEmpty(),
        check('from', 'From date is required')
            .not()
            .isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        position,
        medical,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        position,
        medical, 
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ doctor: req.doctor.id });
        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', authDoctor, async (req, res) => {
    try {
        const profile = await Profile.findOne({ doctor: req.doctor.id });
        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        
            profile.experience.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put('/education', [
    authDoctor,
    [
        
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };

      try {
        const profile = await Profile.findOne({ doctor: req.doctor.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
  
router.delete('/education/:edu_id', authDoctor, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ doctor: req.doctor.id });
      foundProfile.education = foundProfile.education.filter(
        (edu) => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
});





 
module.exports = router;