const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
dotenv.config();
const generateOTP = require("../service/generateOtp");
const Parent = require("../model/ParentModel");
var moment = require("moment");

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

router.post("/createParents", async (req, res) => {
  const { email, password, schoolCode } = req.body;
  const error = [];
  if (error.length > 0) {
    res.status(400).json({ errorMessage: error });
  } else {
    try {
      const checkUser = await Parent.findOne({
        email: email,
      });
      if (checkUser) {
        res.status(404).json({ errorMessage: "Your email already exist" });
      } else {
        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 10 * 60000);
        const result = await Parent.create({
          email: email,
          password: await bcrypt.hash(password, 10),
          otp: otp,
          isActive: true,
          otpExpiration: otpExpiration,
          schoolCode: schoolCode,
        });
        console.log(result);
        if (result) {
          res.status(200).send({ successMessage: "Email sent successfully" });
          // let mailOption = {
          //   from: process.env.SMTP_MAIL,
          //   to: email,
          //   subject: "dote support team",
          //   text: `Your OTP code is: ${otp} and code will expire in 10 minutes`,
          // };
          // transporter.sendMail(mailOption, function (error) {
          //   if (error) {
          //     res.status(404).send(error);
          //   } else {
          //     res
          //       .status(200)
          //       .send({ successMessage: "Email sent successfully" });
          //   }
          // });
        }
      }
    } catch (error) {
      res.status(404).send({ errorMessage: error });
    }
  }
});

router.post("/ParentsDeleteAccount/:id",async(req,res)=>{

try {

  const data = await Parent.findOne({_id: req.params.id});
  if(data){
    const result = await Parent.findByIdAndUpdate(
      { _id: data._id },
      { $set: { isActive: false } },
      { new: true }
    );
    console.log(result);
    res.status(200).send({successMessage: "Account deleted"});
  }
  
} catch (error) {
  res.status(400).send({errorMessage: error});
}

});



router.post("/verifyEmail", async (req, res) => {
  try {
    const result = await Parent.findOne({ otp: req.body.otp });
    if (result) {
      res.status(200).json({ sucessMessage: "Your otp verified" });
    } else {
      res.status(200).json({ errorMessage: "Your otp verified" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/ParentChangePassword", async (req, res) => {
  try {
    const data = await Parent.findOne({ _id: req.body.id });
    console.log(data);
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(req.body.password, salt);
    const userData = await Parent.findByIdAndUpdate(
      { _id: data._id },
      { $set: { password: securePass } },
      { new: true }
    );
    res.status(200).send({
      successMessage: "Your password has been updated",
    });
  } catch (error) {
    res.status(500).send({
      errorMessage: [error],
    });
  }
});
router.post("/ParentResetPassword", async (req, res) => {
  try {
    const tokenData = await Parent.findOne({ token: req.body.token });
    if (tokenData) {
      const pass = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(pass, salt);
      const userData = await Parent.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: securePass, token: "" } },
        { new: true }
      );
      res.status(200).send({
        successMessage: "User password has been reset",
      });
    } else {
      res.status(200).send({ errorMessage: error });
    }
  } catch (error) {
    res.status(400).send({ errorMessage: error });
  }
});

router.post("/parentsLogin", async (req, res) => {
  const error = [];
  const { email, password } = req.body;
  console.log(req.body);
  if (error.length > 0) {
    res.status(400).json({
      error: error,
    });
  } else {
    try {
      const checkUser = await Parent.findOne({
        email: email,
      });
      console.log(checkUser);
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
              isActive: checkUser.isActive,
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
            isActive: checkUser.isActive,
            token,
          });
        } else {
          res.status(400).json({
            errorMessage: "Your Password not Valid",
          });
        }
      } else {
        res.status(400).json({
          errorMessage: "Your Email Not Found",
        });
      }
    } catch (error) {
      res.status(500).send({ errorMessage: error });
    }
  }
});

router.post("/parentCheckEmail",async(req,res)=>{
    console.log(req.body);
  try {
    const userData = await Parent.findOne({ email: req.body.email });
    if (userData) {
  const  update = await Parent.findByIdAndUpdate(
              userData._id,
              { $set: {token: randomString.generate()}},
              { new: true }
            );
      res.status(200).json({successMessage: 'Your token generated',token: update.token});
    } else {
      res.status(401).send({errorMessage: error});
    }
  } catch (error) {
    res.status(200).send({
      errorMessage: error
    })
  }
  
  });



module.exports = router;
