require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var gravtar = require('gravatar');
const router = express.Router();
const User = require('../../model/User')
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
 const secretkey = process.env.secretkey
const authUser= require("../../middleware/authUser")






//user registration route : api/users 
router.post('/register', [
    // check("email", "please enter valid email address").isEmail(),
    check("phone", "please enter valid phone").isMobilePhone(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email,password,phone} = req.body;
    try {
        let user = await User.findOne({ phone })
        if (user) {
            res.status(400).json({ error: " user already exisit " })
        }

        const avatar = gravtar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name, email, avatar, password,phone
        })
        // json webtoken 

        const payload = {
            user: {
                id: user.id
            }
        }

        //encrypt the password using  bcrypt
        const salt = await bcrypt.genSalt(5);

        user.password = await bcrypt.hash(password, salt);
        await user.save();


        jwt.sign(payload, secretkey, { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            })

    

 

    



    }catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');}


});




// user login : api/users/login


router.post("/login",[
  check("phone", "please enter valid phone").isMobilePhone(),
    // check('password','enter password').exists()

],async(req, res) =>{ 
    
    const error = validationResult(req)
    if ( !error.isEmpty()){ 
       return res.status(400).json({ error: error.array() })
    }
        const { email ,password ,phone } = req.body
   try{ 
      let user = await User.findOne({phone})
      if(!user){ 
        return res.status(404).json({ error:"invalid phone" })
      }
          
        
      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
          return res.status(404).json({ error: 'Invalid password' })
      } 

      //return jsonwebtoken 

      const payload = { user: {
        id : user.id 
      }}

      jwt.sign(payload, secretkey, {expiresIn: 360000}, (err,token) =>{
        if(err) throw err;
        res.json({token})
      } ); 







   




   }catch ( err){ 
    console.error(err.message);
    res.status(500).send('Server error');
   }
})

 

//rout get : api/users/getuser

router.get('/getuser', authUser, async (req, res) => {
       try{ 
         const user = await User.findById(req.user.id).select('-password'); 
         res.json(user); 

       }catch(err){ 
        console.error(err.message);
        res.status(500).send("Server Error");
       }
})




//rout get : api/users/deleteuser
router.delete("/deleteuser",authUser,  async(req, res)=>{
  try{
    
    await User.findOneAndRemove({_id:req.user.id})
    res.json({msg:"user deleteuser"})
  }catch(err){ 
    console.error(err.message);
    res.status(500).send('Server error');
  }
} )



module.exports = router;