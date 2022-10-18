require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const secretkey = process.env.secretkey
module.exports =function(req, res, next){

    //get token form the user
const token = req.header("x-auth-token");

//chek if no token 
if(!token){
    return res.status(401).json({error:"no token"}); 

}

//varify token 

try{
const decoed = jwt.verify(token ,  secretkey) ; 
req.user= decoed.user ; 
next();                                                                                                                                                                                                                                                                                                 9
}catch(err){ 
    res.status(401).json({ msg: "token is not valid " });
    console.log(err.message);
}

}