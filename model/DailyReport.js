const mongoose = require("mongoose");
const dailySchema = new mongoose.Schema(
  {
    childDetails: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      }
    },
    parentId: {
      type: String,
    },
    roomName: {
      type: String,
    },
    feedName: {
      type: String,
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("DailyReport", dailySchema);
