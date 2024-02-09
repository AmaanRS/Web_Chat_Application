const mongoose = require("mongoose")

const userModel = new mongoose.Schema({

    username:{
        required:true,
        type:String,
        trim:true
    },
    password:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    //Newly added testing this field is remaining
    friends: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userModel"
        //   validate: function(value){
        //     console.log("validate")
        //     console.log(this.friends)
        //   }
        }
      ]
},{
    timestamps:true
})

module.exports = mongoose.model("userModel",userModel)