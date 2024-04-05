const jwt = require("jsonwebtoken")

function tokenVerify(token){

    try {
        
        if(!token){
            return {message:"Token is necessary for verification for verification",success:false}
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        return {message:"The user is authenticated",success:true,decodedToken:decodedToken}


    } catch (error) {
        console.log(error.message)
        return {message:"User not authenticated",success:false}

    }

}

module.exports = tokenVerify