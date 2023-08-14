const express = require("express");
const router = express.Router();
const validator = require("validator");
const Staff = require("../model/StaffModel");
const Director = require("../model/DirectorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/createStaff", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dob,
      phone,
      gender,
      ethnicity,
      medication,
      allergies,
      doctorPhone,
      emergencyContactNumber,
      emergencyContactType,
      notes,
      country,
      province,
      area,
      block,
      certification,
      role,
      directorId,
      password,
    } = req.body;

    const error = [];

    if (!firstName) {
      error.push("Please provide your first name");
    }
    if (!lastName) {
      error.push("Please provide your last name");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Please provide your email");
    }
    if (password && password.length < 6) {
      error.push("Password length must be 8 characters");
    }
    if (!phone) {
      error.push("Please provide your phone number");
    }
    if (!dob) {
      error.push("Please provide your dob");
    }
    if (!ethnicity) {
      error.push("Please provide your ethnicity");
    }
    if (!medication) {
      error.push("Please provide your medication name");
    }
    if (!allergies) {
      error.push("Please provide your allergy name");
    }
    if (!doctorPhone) {
      error.push("Please provide your last name");
    }
    if (!emergencyContactNumber) {
      error.push("Please provide your emergency contact");
    }
    if (!emergencyContactType) {
      error.push("Please provide your emergency type");
    }
    if (!notes) {
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

    if (!certification) {
      error.push("Please provide your certificate name");
    }
    if (!role) {
      error.push("Please mention your role");
    }
    if (!gender) {
      error.push("Please provide your gender");
    }
    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      try {
        const checkUser = await Staff.findOne({
          email: email,
        });

        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your staff email already exist"],
            },
          });
        } else {
          try {
            const hash = await bcrypt.hash(password, 10);
            console.log(hash);
            const result = await Staff.create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              dob: dob,
              phone: phone,
              gender: gender,
              ethnicity: ethnicity,
              medication: medication,
              allergies: allergies,
              doctorPhone: doctorPhone,
              emergencyContactNumber: emergencyContactNumber,
              emergencyContactType: emergencyContactType,
              notes: notes,
              country: country,
              province: province,
              area: area,
              block: block,
              certification: certification,
              role: role,
              password: hash,
              directorId: directorId,
                isActive: true
            });

       if(result){
        const staffId = await Director.findByIdAndUpdate(
          { _id: directorId },
          { $push: { staff: result._id.toString() } },
          { new: true }
        );

       }


            const token = jwt.sign(
              {
                id: result._id,
                name: `${result.firstName}${result.lastName}`,
                email: result.email,
              },

              process.env.SECRET,
              {
                expiresIn: process.env.TOKEN_EXP,
              }
            );
            const options = {
              expires: new Date(
                Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
              ),
            };

            res.status(200).cookie("authToken", token, options).json({
              successMessage: "Your Staff Register Successful",
              token,
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
        errorMessage: [error],
      },
    });
  }
});

router.get("/getStaffs/:id", async (req, res) => {
  try {
    const result = await Staff.find({ directorId: req.params.id }).sort({
      createdAt: "desc",
    });
    res.status(200).send({
      staffs: result,
    });
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: [error],
      },
    });
  }
});

router.get("/getProfile/:id", async (req, res) => {
  try {
    const result = await Staff.findOne({ _id: req.params.id });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      successMessage: "Data Retrieved",
      result,
    });
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: [error],
      },
    });
  }
});

router.post("/staffLogin",async(req,res)=>{
  const error = [];
  const { email, password } = req.body;

  if (!email) {
    error.push("Please provide your Email");
  }
  if (!password) {
    error.push("Please provide your Passowrd");
  }
  if (email && !validator.isEmail(email)) {
    error.push("Please provide your Valid Email");
  }
  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {

      const checkUser = await Staff.findOne({
        email: email,
      });



      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );
        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.email,
              name: `${checkUser.firstName}${checkUser.lastName}`,
              registerTime: checkUser.createdAt,
            },
            process.env.SECRET,
            {
              expiresIn: process.env.TOKEN_EXP,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authToken", token, options).json({
            successMessage: "Your Login Successful",
            token,
          });
        } else {
          res.status(400).json({
            error: {
              errorMessage: ["Your Password not Valid"],
            },
          });
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ["Your Email Not Found"],
          },
        });
      }
    } catch (error) {
      res.status(500).send({ error: {
        errorMessage: [error]
      } });
    }
  }
});

module.exports = router;
