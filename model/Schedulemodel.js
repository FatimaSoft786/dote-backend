const mongoose = require("mongoose");
const scheduleSttaff = mongoose.Schema({
scheduleType: {
    type: String,
    default: ''
},
staffId: {
    type: String,
    default: ''
},
roomName: {
    type: String
},
roomId: {
    type: String
},
startDate: {
    type: String,
    default: String
},
endDate: {
    type: String,
    default: String
},
startTime: {
    type: String,
    default: String
},
endTime: {
    type: String,
    default: String
},
description: {
    type: String,
    default: String
},
directorId: {
    type: String,
    default: ''
},
days: {
    type: [String],
    default: ''
}



});
module.exports = mongoose.model("Schedules",scheduleSttaff);