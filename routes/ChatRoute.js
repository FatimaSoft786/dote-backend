const express = require("express");
const router = express.Router();
const chat = require("../model/ChatModel");
const Staff = require("../model/StaffModel");
const Director = require("../model/DirectorModel");

router.post("/getDirectorId/:id", async (req, res) => {
  try {
    const details = await Staff.findOne({ _id: req.params.id });
    const result = await chat.find({
      members: { $in: [req.params.id] },
    });
    if (result.length === 0) {
      const result = await chat.create({
        members: [req.params.id, details.directorId],
      });
      res.status(200).send(result);
    } else {
      res.status(200).send("members exist");
    }
  } catch (error) {
    res.status(500).send({
      error: {
        errorMessage: [error],
      },
    });
  }
});

router.get("/userChat/:userId", async (req, res) => {
  try {
    const result = await chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/find/:firstId/:secondId", async (req, res) => {
  try {
    const result = await chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    const result = await Director.findOne({ _id: req.params.id });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
