require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const secretkey = process.env.secretkey
module.exports = async (req, res, next) => {
 const token = req.header("x-auth-token"); 
// check if not token 

if(!token){ 
    return  res.status(403).json({error : "invalid token"});

}
//varify token 

try{ 
      const decoded = jwt.verify(token, secretkey); 
      console.log(decoded)
      req.doctor = decoded.doctor;
      next(); 
}catch(err){

    console.log(err.message);
    res.status(401).json({ msg: "token is not valid " });}


} 


