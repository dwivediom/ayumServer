const { Router } = require('express');
const express= require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const user= require('./routes/api/user')
const doctor = require('./routes/api/doctor');
const appointment = require('./routes/api/appointment');
const profile = require('./routes/api/profile')
const search = require('./routes/api/search')
const dailyappo= require('./routes/api/dailyAppointemnt')
const admin=require('./routes/api/admin')
const clinic=require('./routes/api/clinic')
const docAppointment=require('./routes/api/docAppointment')
mongoose.connect(db )
.then( () => {console.log("database connection established")} )
.catch( (err) => {console.log("database connection failed",err)} );
const cors = require('cors')
app.use(cors())


//router initalisze middleware
app.use(express.json({ extended: false}));


 app.use("/api/user", user)
 app.use("/api/doctor", doctor)
 app.use("/api/appointment", appointment)
 app.use("/api/profile",profile)
 app.use("/api/clinic",clinic)
 app.use("/api",search)
 app.use("/api",dailyappo)
 app.use("/admin", admin)
 app.use("/api/docappointment", docAppointment)
const port = process.env.PORT || 5000;
app.listen(port,() => {console.log(`server listening on ${port}`)});