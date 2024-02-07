const jwt = require("jsonwebtoken")

const cookieChecker = async( req, res, next )=>{
    //Get token from the request's header
    const token = req.headers.authorization?.split("Bearer ")[1]

    //If token does not exist send the control to the next call and send the message
    if(!token){
        req.middlewareRes = {message:"User not authenticated",success:false}

        next()
    }

    try {
        //Check the token with secret key
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        req.middlewareRes = {message:"The user is authenticated",success:true,decodedToken:decodedToken}

        next()

    } catch (error) {
        req.middlewareRes = {message:"User not authenticated",success:false}
        
        next()
    }
}

module.exports = { cookieChecker }