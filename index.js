const connectMongo = require('./db');
const express = require('express');
var cors  = require('cors');
require('dotenv').config();
connectMongo();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

 const ParentRoute = require('./routes/ParentRoute');
app.use('/api',ParentRoute);
  const authRoute = require("./routes/DirectorsRoute");
  const pictureRoute = require("./routes/DirectorProfileRoute");
  const roomRoute = require("./routes/RoomsRoute");
  const directorRoute = require("./routes/DirectorsRoute");
  const FormRoute = require("./routes/StudentRoute");
  const StaffRoute = require("./routes/StaffRoute");
  const ScheduleRoute = require("./routes/ScheduleRoute");
  const ChildRoute = require("./routes/ChildRoute");
  const dailyRoute = require("./routes/dailyRoute");
  const chatRoute = require("./routes/ChatRoute");
  const messageRoute = require("./routes/MessageRoute");
  const StudentRoute = require('./routes/StudentRoute');
 
  app.use('/api',authRoute);
  app.use('/api',pictureRoute);
  app.use('/api',roomRoute);
  app.use('/api',directorRoute);
  app.use('/api',FormRoute);
  app.use('/api',StaffRoute);
  app.use('/api',ScheduleRoute);
  app.use('/api',ChildRoute);
  app.use('/api',dailyRoute);
  app.use('/api',chatRoute);
  app.use('/api',messageRoute);
  app.use('/api',StudentRoute);
  
  

  app.listen(port, ()=>{
    console.log("listening perfect");
  });
