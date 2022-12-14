require('dotenv').config();
const express = require('express');

const router = express.Router();
var gravtar = require('gravatar');
const app = express();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require("../../model/Doctor");
const authDoctor = require('../../middleware/authDoctor');
const secretkey = process.env.secretkey
const Profile = require('../../model/Profile'); 
const DailyAppo = require('../../model/Dailyappointment')
// login in not rquierd  
//  doctor registration : http://localhost:5000/api/doctor/register 


router.post('/register', [
    check("name", 'Name is required').not().isEmpty(),
    check("phone", ' Eenter valid Phone ').isLength({min:10, max:13}),
    check('city', 'enter city ').not().isEmpty()
],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }


        const { name, email,phone, password,city } = req.body;
        try {

            // to check doctor already exists
            let doctor = await Doctor.findOne({ phone })
            if (doctor) {
                return res.status(400).json({ error: "doctor already exists" });
            }
            //get doctor gravtar
            const avatar = gravtar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",

            });
            doctor = new Doctor({
                name,
                email,
                avatar,
                password,
                phone,
                city 
            })

            //ectrypt password 
            const salt = await bcrypt.genSalt(6);
            doctor.password = await bcrypt.hash(password, salt);
            await doctor.save();

            // Return jsonwebtoken 

            const payload = {
                doctor: {
                    id: doctor.id
                }
            }
            

            jwt.sign(payload, secretkey, { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })


        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
                  
        }
    });


  // doctor login ::  
    // route : http://localhost:5000/api/doctor/register 

   router.post('/login',[
    check("phone", ' Eenter valid Phone ').isLength({min:10, max:13}),
       check('password', "invalid password").exists()
   ], async(req, res)=>{ 
              const error = validationResult(req) ;
              if(!error.isEmpty()) {
                return res.status(400).json({ error: error.array() });
            }


          const { phone , password  } = req.body; 
           try{ 
            // if user dose not exixt 

            const doctor = await Doctor.findOne({phone})
            if( !doctor){ 
                return res.status(400).json({ errors:"user not found " });
            }
          // compair password 
          const isMatch = await  bcrypt.compare(password, doctor.password); 
          if(!isMatch) {
            return res.status(400).json({ errors:"password mismatch " });
          } 
          // return json webtoken 

            const playload ={ 
                doctor: { id: doctor.id}
            }

           jwt.sign(playload, secretkey , {expiresIn: 36000},
            (err, token) => {
                if(err) throw err;
                res.json({ token })});
                 
           }catch(err){
            console.log(err.message);
            res.status(500).send('Server error');
           } 

   });
     
 // get doctor data 
 // route : gin ::  
    // route get : http://localhost:5000/api/doctor/getdoctor 

     router.get("/getdoctor",authDoctor, async (req, res) => {
         try{
              const doctor = await Doctor.findById(req.doctor.id).select('-password'); 
              res.json(doctor)
         }  catch(err){ 
            console.log(err.message);
            res.status(500).send("Server Error");
         } 
      })

       
      // @api    
      // @des   delete doctor profile 


     














    module.exports= router; 