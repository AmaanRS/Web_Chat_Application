const userModel = require("../Models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const login = async (req,res)=>{
    try{
        //Get the data from the request
        let { email, password } = req.body
        
        //If email and password exist
        if( email && password ){

            //Try to get the email from the database
            let doesEmailExist = await userModel.findOne({email:email})

            //If the database does not returns the data of the user
            if(!doesEmailExist){
                return res.json({message:"Either email or password entered is wrong"})
            }

            //Check the user input password against the password from the database
            let matchPassword = await bcrypt.compare(password,doesEmailExist.password)

            //If the passwords do not match
            if(!matchPassword){
                return res.json({message:"Either email or password entered is wrong"})
            }

            //Create a jwt token
            let token = jwt.sign({email:email},process.env.JWT_SECRET)

            //Create a cookie using a token and add it to the response object
            res.cookie("token",token,{maxAge:60*60*60,httpOnly:true})

            //Send the message to the frontend that the user is now logged in
            return res.json({message:"You have been logged in successfully"})
        }
        //If either email or password does not exist
        else{
            return res.json({message:"Either email or password is missing"})
        }
    }catch(e){
        console.log("There is some error in login controller")

        //Logging the error
        console.log(e.message)

        //Send the message to the frontend that the user is not logged in
        return res.json({message:"There is some problem in logging in"})
    }
}

const signup = async (req,res)=>{
    try {
        const { username, email, password } = req.body;

        if( email && password ){

            const hashedPassword = await bcrypt.hash(password,8)

            const isUserCreated = await userModel.create({username:username,email:email,password:hashedPassword})

            if( !isUserCreated ){
                return res.json({message:"User not created"})
            }
            return res.json({message:"Your account has been created now you can login"})

        }else{
            return res.json({message:"Enter both email and password"})
        }
    } catch (e) {
        //Logging the error
        console.log(e.message)

        //Send the message to the frontend that the user is not logged in
        return res.json({message:"There is some problem in signning up"})
    }
    
}



module.exports = { login,signup }