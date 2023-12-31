const express = require("express");
const router = express.Router();
const DailyReport = require("../model//DailyReport");
const Child = require("../model/ChildModel");
const Student = require("../model/StudentForm");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

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


router.post(
  "/createReport/:id",
  upload.single("reportPhoto"),
  async (req, res) => {
    try {
      const childFind = await Student.findOne({ _id: req.params.id });
      console.log(childFind);
      let data = {
        firstName: childFind.firstName,
        lastName: childFind.lastName
      };
      if (data) {
        const result = await DailyReport.create({
          childDetails: data,
          staffId: req.body.staffId,
          feedName: req.body.feedName,
          roomName: req.body.roomName,
          description: req.body.description,
          photo: req.file.location,
        });
      console.log(data);
        res.status(200).send({
          successMessage: result,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: {
          errorMessage: [error],
        },
      });
    }
  }
);

router.get("/getFeed",async(req,res)=>{
try {
  const result = await DailyReport.find().sort({createdAt: 'desc'});
res.status(200).send({
    feeds: result
});
} catch (error) {
    res.status(500).send({
        error: {
            errorMessage: [error]
        }
    })
}

});



module.exports = router;
