const express = require("express");
const router = express.Router();
const Room = require("../model/RoomModel");

router.post("/createRoom", async (req, res) => {
  try {
    const { roomName,directorId } = req.body;

    const error = [];

    if (!roomName) {
      error.push("Please provide your room name");
    }
   
    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      try {

        const checkRoom = await Room.findOne({
          roomName: roomName,
      });

      if (checkRoom) {
        res.status(404).json({
          error: {
            errorMessage: ["This room already exist"],
          },
        });

      }else{
        const result = await Room.create({
          roomName,
          directorId
        });
  

        res.status(200).json({
          successMessage: "Your room has been registered"
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
        errorMessage: ["Internal Server error"],
      },
    });
  }
});

router.get("/getRooms/:id",async(req,res)=> {

  try {
    const result = await Room.find({directorId: req.params.id}).sort({createdAt: 'desc'});
    if(result){
    }
    res.status(200).send({
        rooms: result
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
