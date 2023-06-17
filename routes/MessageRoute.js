const express = require("express");
const router = express.Router();
const message = require("../model/MessageModel");

router.post("/addMessage",async(req,res)=>{
    const { chatId, senderId, text } = req.body;
    
    try {
        const result = await message.create({
            chatId,
            senderId,
            text,
          });
    
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.get("/messages/:chatId",async(req,res)=>{
    const { chatId } = req.params;
    try {
      const result = await message.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
});

module.exports = router;