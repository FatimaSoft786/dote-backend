const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    desiredStart: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    directorId: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

module.exports = mongoose.model("StudentsApplications",FormSchema);