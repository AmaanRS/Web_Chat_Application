const jwt = require("jsonwebtoken")

const cookieChecker = async( req, res, next )=>{

    //Get token from cookies
    const token = req.cookies["token"]

    //If token does not exist
    if(!token){
        return res.json({message:"User not authenticated"})
    }

    //Check the token with secret key
    const isUserCorrect = jwt.verify(token,process.env.JWT_SECRET)

    //If the token is not correct
    if(!isUserCorrect){
        return res.json({message:"User not authenticated"})
    }
    next()
}

module.exports = { cookieChecker }