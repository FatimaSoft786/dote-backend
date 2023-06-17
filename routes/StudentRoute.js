const express = require("express");
const router = express.Router();
const validator = require("validator");
const Form = require("../model/StudentForm");


router.post("/createRequest", async (req, res) => {
  try {
    const { firstName, lastName, parentEmail,parentName,program,dob, directorId } = req.body;

    const error = [];

    if (!firstName) {
      error.push("Please provide your first name");
    }
    if (!lastName) {
        error.push("Please provide your last name");
      }
      if (!program) {
        error.push("Please provide your program");
      }
      if (!dob) {
        error.push("Please provide your dob");
      }

    if (!parentName) {
      error.push("Please provide your parent name");
    }

    if (parentEmail && !validator.isEmail(parentEmail)) {
        error.push("Please provide your email");
      }

    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      try {
        const checkUser = await Form.findOne({
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
            const result = await Form.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              program: req.body.program,
              desiredStart: req.body.desiredStart,
              dob: req.body.dob,
              status: req.body.status,
              parentName: req.body.parentName,
              parentEmail: req.body.parentEmail,
              directorId: req.body.directorId,
            });
      

            res.status(200).json({
              successMessage: "Your application Register Successful",
            });
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
    }
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: ["Internal Server error"],
      },
    });
  }
});

router.get('/getRequests/:id',async(req,res)=>{

try {
const result = await Form.find({directorId: req.params.id}).sort({createdAt: 'desc'});
res.status(200).send({
    applications: result
}); 
} catch (error) {
    res.status(500).send({
        error: {
            errorMessage: [error]
        }
    });
}
 });



 router.put('/updateStatus',async(req,res)=>{
try {
  console.log(req.body);
    const {status,id} = req.body;
    const newInfo = {};
    if(status){newInfo.status = status};
    let update = await Form.findById(id);
if(!update){
   return res.status(404).send("Not Found");
}
update = await Form.findByIdAndUpdate(id,{$set: newInfo},{new: true});
 res.status(200).send({
  successMessage: 'Your record updated'
 })
    
} catch (error) {
    res.status(500).json({
        error: {
            errorMessage: ['Internal Server Error']
        }
    });
}
 });


 router.get("/getStatus/:id",async(req,res)=>{
   try {
    const result = await Form.find({directorId: req.params.id});
    res.status(200).send({
        applications: result.status
    });
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: [error]
      }
    });
  }
   });

module.exports = router;