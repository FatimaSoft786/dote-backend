const mongoose = require('mongoose');
const DirectorSchema =  mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    directorName: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    schoolName: {
        type: String,
        required: true
    },
    schoolLocation: {
        type: String,
        required: true
    },
    staff: {
        type: Array
    },
    schoolPicture: {
        type: String,
        default: ''
    },
    token:{
        type: String,
        default: ''
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Directors",DirectorSchema)