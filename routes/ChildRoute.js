const express = require("express");
const router = express.Router();
const validator = require("validator");
const Child = require("../model/ChildModel");
const Room = require("../model/RoomModel");

router.post("/createChild", async (req, res) => {
  try {
    const { firstName,lastName,dob,gender,roomName,status,enrollmentDate,rotation,parentName,parentEmail,mobilePhone,otherPhone,relationship,emergencyContact,emergencyType,address,country,province,block,area,allergy,profileNotes,directorId,roomId} = req.body;
    
  const profileUrl = " https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg";


    const error = [];

    if (!firstName) {
      error.push("Please provide your first name");
    }
    if (!lastName) {
      error.push("Please provide your last name");
    }
    if (parentEmail && !validator.isEmail(parentEmail)) {
      error.push("Please provide your email");
    }
    if (!mobilePhone) {
      error.push("Please provide your mobile number");
    }
    if (!dob) {
      error.push("Please provide your dob");
    }
    if (!gender) {
        error.push("Please provide your gender");
      }

      if (!roomName) {
        error.push("Please provide your room name");
      }

      if(!status){
        error.push("Please provide your status");
      }

      if(!enrollmentDate){
        error.push("Please provide your enrollment date");
      }

      if(!relationship){
        error.push("Please provide your relationship");
      }
      if(!rotation){
        error.push("Please provide rotation");
      }
      if(!parentName){
        error.push("Please provide your parent name");
      }
      if(!otherPhone){
        error.push("Please provide your other phone");
      }
      if(!emergencyContact){
        error.push("Please provide your emergency contact");
      }
      if(!emergencyType){
        error.push("Please provide your emergency type");
      }
      if(!address){
        error.push("Please provide your emergency type");
      }
      if (!profileNotes) {
        error.push("Please provide your notes");
      }
      if (!country) {
        error.push("Please provide your country name");
      }
     
      if (!province) {
        error.push("Please provide your province name");
      }
      if (!area) {
        error.push("Please provide your area name");
      }
      if (!block) {
        error.push("Please provide your block name");
      }
      if (!allergy) {
        error.push("Please provide your allergy");
      }
  
    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      try {
        const checkUser = await Child.findOne({
          parentEmail: parentEmail,
        });

        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your parent email already exist"],
            },
          });
        } else {
          try {
            const result = await Child.create({
                firstName,lastName,dob,gender,roomName,status,enrollmentDate,rotation,parentName,parentEmail,mobilePhone,otherPhone,relationship,emergencyContact,emergencyType,address,country,province,block,area,allergy,profileNotes,directorId,profileUrl
            });

            const childId = result._id.toString()
            if(childId){
              var child = {firstName: firstName, lastName: lastName,profileUrl: profileUrl,id: childId};
             const updatedUser = await Room.findByIdAndUpdate(
               { _id: roomId },
               { $push: { students: child } },
               { new: true }
             );
             res.status(200).json({
               successMessage: "Your child added successfully"
             });
            }
          } catch (error) {
            res.status(500).send({
              error: {
                errorMessage: error,
              },
            });
          }
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
        errorMessage: [error],
      },
    });
  }
});

router.get("/getChilds/:id",async(req,res)=> {

  try {
    const result = await Child.find({directorId: req.params.id}).sort({createdAt: 'desc'});
    res.status(200).send({
        childs: result
    })
        
    } catch (error) {
        res.status(500).send({
            error: {
                errorMessage: [error]
            }
        })
    }

});

module.exports = router;