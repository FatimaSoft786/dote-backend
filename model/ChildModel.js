const mongoose = require("mongoose");
const childSchema = new mongoose.Schema({

    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    dob: {
        type: String,
        default: ''
    },
    profileUrl: {
        type: String,
        default: ''
    },
    gender: {
        type: String
    },
    roomName: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    enrollmentDate: {
        type: String,
        default: ''
    },
    rotation: {
        type: String,
        default: ''
    },
    schedule: {
        type: Array
    },
    parentName: {
        type: String,
        default: ''
    },
    parentEmail: {
        type: String,
        required: true
    },
    mobilePhone: {
        type: String,
        default: ''
    },
    otherPhone: {
        type: String,
        default: ''
    },
    relationship: {
        type: String,
        default: ''
    },
    emergencyContact: {
        type: String,
        default: ''
    },
    emergencyType: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    block: {
        type: String
    },
    area: {
        type: String,
        default: ''
    },
    allergy: {
        type: String,
        default: ''
    },
    profileNotes: {
        type: String,
        default: ''
    },
    directorId: {
        type: String
    }


});
module.exports = mongoose.model("Childs",childSchema);