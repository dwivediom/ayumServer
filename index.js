const { Router } = require('express');
const express= require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('../backend/config/keys').mongoURI;
const user= require('../backend/routes/api/user')
const doctor = require('../backend/routes/api/doctor');
const appointment = require('../backend/routes/api/appointment');
const profile = require('../backend/routes/api/profile')
const search = require('../backend/routes/api/search')
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
 app.use("/api",search)

const port = process.env.PORT || 5000;
app.listen(port,() => {console.log(`server listening on ${port}`)});