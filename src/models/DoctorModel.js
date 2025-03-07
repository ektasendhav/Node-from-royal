const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({


    email:{
        type:String,
    },
    password:{
        type:String
    },
    name:{
        type:String,
    },
    contact:{
        type:Number,
    },
    gender:{
        type:String,
    },
    userType:{
        type:String,
    },


    
})

module.exports = mongoose.model("Doctor",DoctorSchema)

