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
                return res.json({message:"Either email or password entered is wrong",success:false})
            }

            //Check the user input password against the password from the database
            let matchPassword = await bcrypt.compare(password,doesEmailExist.password)

            //If the passwords do not match
            if(!matchPassword){
                return res.json({message:"Either email or password entered is wrong",success:false})
            }

            // I will be creating the jwt token in the backend at set the token using frontend

            //Create a jwt token
            let token = jwt.sign({email:email},process.env.JWT_SECRET)

            //Create a cookie using a token and add it to the response object
            // res.cookie("token",token,{maxAge:60*60*60,httpOnly:true,sameSite: 'None'})



            //Send the message to the frontend that the user is now logged in
            return res.json({message:"You have been logged in successfully",success:true,token:token})
        }
        //If either email or password does not exist
        else{
            return res.json({message:"Either email or password is missing",success:false})
        }
    }catch(e){
        console.log("There is some error in login controller")

        //Logging the error
        console.log(e.message)

        //Send the message to the frontend that the user is not logged in
        return res.json({message:"There is some problem in logging in",success:false})
    }
}

const signup = async (req,res)=>{
    try {
        const { username, email, password } = req.body;

        if( email && password ){

            const hashedPassword = await bcrypt.hash(password,8)

            const isUserCreated = await userModel.create({username:username,email:email,password:hashedPassword})

            if( !isUserCreated ){
                return res.json({message:"User not created",success:false})
            }
            return res.json({message:"Your account has been created now you can login",success:true})

        }else{
            return res.json({message:"Enter both email and password",success:false})
        }
    } catch (e) {
        //Logging the error
        console.log(e.message)
        
        if(e.code == 11000){
            return res.json({message:"This email is already registered",success:false})
        }

        //Send the message to the frontend that the user is not logged in
        return res.json({message:"There is some problem in signning up",success:false})
    }
    
}

const mainPage = async (req,res)=>{
    //The user is not authenticated
    if(!req.middlewareRes.success){
        return res.json({message:req.middlewareRes.message,success:req.middlewareRes.success})
    }
    //The user is authenticated and you can do the operations
    return res.json({message:"The user is authenticated",success:true})
}

module.exports = { login,signup,mainPage }