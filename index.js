const { Router } = require('express');
const express= require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('../backend/config/keys').mongoURI;
const user= require('../backend/routs/api/user')
const doctor = require('../backend/routs/api/doctor');
const appointment = require('../backend/routs/api/appointment');
const profile = require('../backend/routs/api/profile')
mongoose.connect(db )
.then( () => {console.log("database connection established")} )
.catch( (err) => {console.log("database connection failed",err)} );

//router initalisze middleware
app.use(express.json({ extended: false}));


 app.use("/api/user", user)
 app.use("/api/doctor", doctor)
 app.use("/api/appointment", appointment)
 app.use("/api/profile",profile)

const port = process.env.PORT || 5000;
app.listen(port,() => {console.log(`server listening on ${port}`)});