const mongoose = require("mongoose")

//Newly added testing this schema is remaining
const conversationSchema = new mongoose.Schema({
    Friend1:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    Friend2:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    },
    ContentField:{
        type: String,
        default:""
    }
},{timestamps:true})

module.exports = mongoose.model("conversationModel",conversationSchema)