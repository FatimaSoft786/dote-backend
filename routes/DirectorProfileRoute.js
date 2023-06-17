const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const DirectorModel = require("../model/DirectorModel");
const jwt = require("jsonwebtoken");
AWS.config.update({
  accessKeyId: "AKIAQLCWCCWOR4RCTJQR",
  secretAccessKey: "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",
});

const s3 = new AWS.S3({
  region: 'me-south-1',
  endpoint: 'https://s3.me-south-1.amazonaws.com',
});




const mybucket = "dotee";

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: mybucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});


router.post("/upload/:id", upload.single("application"), async (req, res) => {
  try {

console.log(req.file);
    const userData = await DirectorModel.findOne({_id: req.params.id });
    if (userData) {
      const  checkUser = await DirectorModel.findByIdAndUpdate(
                  userData._id,
                  { $set: {schoolPicture: req.file.location}},
                  { new: true }
                );


                const token = jwt.sign(
                  {
                    id: checkUser._id,
                    email: checkUser.email,
                    directorName: checkUser.directorName,
                    registerTime: checkUser.createdAt,
                    profilePicture: checkUser.profilePicture
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
                  successMessage: "Your Profile Picture uploaded",
                  token,
                });

        } else {
          res.status(401).send({errorMessage: {error:[error]}});
        }
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: error,
      },
    });
  }
});

module.exports = router;