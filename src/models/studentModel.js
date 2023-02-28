const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = mongoose.Schema({
    firstName:{
        type: String,
        minlength:3
    },
    lastName:{
        type: String,
        minlength:3
    },
    phoneNo:{
        type: String,
        unique:[true,"Phone No. already present"]
    },
    email:{
        type: String
    },
    branch:{
        type: String,
    },
    registrationNo:{
        type: String,
        required: true,
        unique:[true,"Reg No. already present"],
    },
    interestedIn:{
        type: String
    },
    otherTeams:{
        type: String
    },
    attendedOrientation:{
        type: String
    },
    resume:{
        type: String
    },
    resumeShortlist:{
        type: String
    },
    testResult:{
        type: String
    },
    pi1:{
        type: String
    },
    pi2:{
        type: String
    },
    pi1Panel:{
        type: String
    },
    pi2Panel:{
        type: String
    }
})

module.exports = new mongoose.model('students', studentSchema);
