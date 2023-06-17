const express = require("express");
const router = express.Router();
const validator = require("validator");
const Director = require("../model/DirectorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
router.post("/createAccount", async (req, res) => {
  try {
    const { directorName, email, password, schoolName, schoolLocation } = req.body;

    const error = [];

    if (!directorName) {
      error.push("Please provide your director name");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Please provide your email");
    }
    if (password && password.length < 6) {
      error.push("Please provide your password");
    }
    if (!schoolName) {
      error.push("Please provide your school name");
    }
    if (!schoolLocation) {
      error.push("Please provide your location");
    }
    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      try {
        const checkUser = await Director.findOne({
          email: email,
        });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["Your email already exist"],
            },
          });
        } else {
          try {
            const result = await Director.create({
              email: req.body.email,
              password: await bcrypt.hash(password, 10),
              directorName: req.body.directorName,
              schoolName: req.body.schoolName,
              schoolLocation: req.body.schoolLocation,
            });
            console.log(result);
            if(result){
              const token = jwt.sign(
                {
                  id: result._id,
                  email: result.email,
                  directorName: result.directorName,
                  registerTime: result.createdAt,
                  schoolPicture: result.schoolPicture
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
                successMessage: "Your Register Successful",
                token,
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
        res.status(500).json({ error: { errorMessage: [error] } });
      }
    }
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: [error]
      },
    });
  }
});
router.post("/login",async(req,res)=>{
    const error = [];
    console.log(req.body);
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
        const checkUser = await Director.findOne({
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
                directorName: checkUser.directorName,
                registerTime: checkUser.createdAt,
                schoolPicture: checkUser.schoolPicture
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
        res.status(500).send({ error: ['Internal Server Error'] });
      }
    }
});

router.post("/checkEmail",async(req,res)=>{
try {
  const userData = await Director.findOne({ email: req.body.email });
  if (userData) {
const  update = await Director.findByIdAndUpdate(
            userData._id,
            { $set: {token: randomString.generate()}},
            { new: true }
          );
    res.status(200).json({successMessage: 'Your token generated',token: update.token});
  } else {
    res.status(401).send({errorMessage: {error:[error]}});
  }
} catch (error) {
  res.status(200).send({
    errorMessage: {
      error: [error]
    }
  })
}

});

router.post("/resetPassword",async (req, res) => {
    try {
      const tokenData = await Director.findOne({ token: req.body.token });
      console.log(tokenData.token)
      if (tokenData) {
        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(pass, salt);
        const userData = await Director.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: securePass, token: "" } },
          { new: true }
        );
        res
          .status(200)
          .send({
            successMessage: "User password has been reset"
          });
      } else {
        res.status(200).send({errorMessage: {error: [error]}});
      }
    } catch (error) {
      res.status(400).send({errorMessage: {error: [error]}});
    }
  }
);

router.post("/changePassword",async(req,res)=>{

  try {
    const data = await Director.findOne({_id: req.body.id });
    console.log(data);
  
      const salt = await bcrypt.genSalt(10);

      const securePass = await bcrypt.hash(req.body.password, salt);

      const userData = await Director.findByIdAndUpdate(
        { _id: data._id },
        { $set: { password: securePass} },
        { new: true }
      );
      res
        .status(200)
        .send({
          successMessage: 'Your password has been updated'
        });
  } catch (error) {
    res.status(500).send({
      errorMessage: [error]
    })
  }


});



module.exports = router;
 