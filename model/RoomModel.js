const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    students: {
        type: Array
    },
    staffs: {
        type: String
    },
    staffId: {
        type: String,
        default: ''
    },
    // students: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Childs'
    //   }],
    directorId: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Rooms",RoomSchema)