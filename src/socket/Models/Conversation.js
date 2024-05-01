const mongoose = require("mongoose")

//Redundant file created because using the same file from backend in socket was not working

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
    ContentField: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"userModel",
            required: true
          },
          receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"userModel",
            required: true
          },
          message: {
            type: String,
            required: true
          },
          timestamp: {
            type: Date,
            default: Date.now
          }
        }
    ]
},{timestamps:true})

module.exports = mongoose.model("conversationModel",conversationSchema)