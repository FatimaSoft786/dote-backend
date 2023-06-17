const mongoose = require("mongoose");
const dailySchema = new mongoose.Schema(
  {
    staffDetails: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      profilePicture: {
        type: String,
      },
      staffId: {
        type: String,
      },
    },
    childId: {
      type: String,
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
