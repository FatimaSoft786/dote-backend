const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
     email: {
      type: String,
      default: ''
     },
     dob: {
      type: String,
      default: ''
     },
     phone: {
      type: String,
      default: ''
  },
  ethnicity: {
      type: String,
      default: ''
  },
  medication: {
      type: String,
      default: ''
  },
  allergies: {
      type: String,
      default: ''
  },
  doctorPhone: {
      type: String,
      default: ''
  },
  emergencyContactNumber:{
      type: String,
      default: ''
  },
  emergencyContactType: {
      type: String,
      default: ''
  },
  notes: {
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
  area: {
    type: String,
    default: ''
  },
  block: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  certification: {
    type: String,
    default: ''
  },
    allocatedRoomId: {
      type: String,
      default: "",
    },
    allocatedRoomName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
       default: 'Signed-up'
    },
    profileUrl: {
      type: String,
      default: "",
    },
    gender: {
        type: String,
        required: true
    },
    checkIn: {
      type: String,
      default: "No",
    },
    password: {
      type: String,
      default: "",
    },
    directorId: {
      type: String,
      required: true,
    },
    schedule: {
        type: Array
    },
  

  },
  { timestamps: true }
);

module.exports = mongoose.model("Staffs", StaffSchema);
