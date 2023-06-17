const express = require("express");
const router = express.Router();
const Schedule = require("../model/Schedulemodel");
const Staff = require('../model/StaffModel');
const Room = require("../model/RoomModel");

router.post("/createSchedule",async(req,res)=>{

try {

    const{scheduleType,staffId,roomName,startDate,endDate,startTime,endTime,description,directorId,days,roomId} = req.body;
    console.log(req.body);
    const error = [];
    if (!scheduleType) {
      error.push("Please provide your schedule type");
    }
    if (!staffId) {
        error.push("Please click again on the staff");
      }
      if (!roomName) {
        error.push("Please provide your room name");
      }
      if (!startDate) {
        error.push("Please provide start date");
      }
      if (!endDate) {
        error.push("Please provide end date");
      }
      if (!startTime) {
        error.push("Please provide start time");
      }
      if (!endTime) {
        error.push("Please provide end time");
      }
      if (!description) {
        error.push("Please provide your description");
      }
      if (!days) {
        error.push("Please provide days");
      }
      if (error.length > 0) {
        res.status(400).json({ error: { errorMessage: error } });
      }
      else{
        try {
            const result = await Schedule.create({
              directorId,scheduleType,staffId,roomName,startDate,endDate,startTime,endTime,description,days,roomId
            });
         const scheduleId = result._id.toString()
         if(scheduleId){
          const updatedUser = await Staff.findByIdAndUpdate(
            { _id: staffId },
            { $push: { schedule: scheduleId } },
            { new: true }
          );

          const room = await Room.findByIdAndUpdate(
            { _id: roomId },
            { $set: { staffId : staffId } },
            { new: true }
          );
   

          res.status(200).json({
            successMessage: "Your Schedule Created Successful"
          });
         }
          } catch (error) {
            res.status(500).send({
              error: {
                errorMessage: [error],
              },
            });
          }
      }
} catch (error) {
    res.status(500).send({
        error: {
errorMessage: [error]
        }
    });
}
});

router.get('/getSchedules/:id',async(req,res)=>{
  try {
  const result = await Schedule.find({directorId: req.params.id}).sort({createdAt: 'desc'});
  // console.log(String(result.staffId));
  // const foundUser = Staff.find((user) => user._id === result.staffId);
  // if (foundUser) {
  //   const foundUserId = foundUser.firstName
  //   console.log(foundUserId); // Output: 2
  // } else {
  //   console.log('User not found');
  // }
  // // const staffInfo = await Staff.find({staffId: result.staffId});
  // // const newResult = result.push(staffInfo)
  res.status(200).send({
      schedules: result
  });    
  } catch (error) {
      res.status(500).send({
          error: {
              errorMessage: [error]
          }
      });
  }
   });

   router.get('/getStaffSchedules/:id',async(req,res)=>{
     try {
      const result = await Schedule.find({staffId: req.params.id}).sort({createdAt: 'desc'});
      res.status(200).send({
        schedules: result
    }); 
     } catch (error) {
      res.status(500).send({
        error: {
          errorMessage: [error]
        }
      });;
     }
   });

   router.get("/getSchedulesRooms/:id",async(req,res)=>{
    try {
      
     const result = await Room.find({staffId: req.params.id}).sort({createdAt: 'desc'});
     res.status(200).send({
       rooms: result
   }); 
    } catch (error) {
     res.status(500).send({
       error: {
         errorMessage: [error]
       }
     });;
    }
  });
   
module.exports = router;