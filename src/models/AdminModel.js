const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    

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
    usertype:{
        type:String,
    },


    
})

module.exports = mongoose.model("Admin",AdminSchema)

//roles[roleSchema]