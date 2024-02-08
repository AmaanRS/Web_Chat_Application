import { getToken } from "./Auth"
import axios from 'axios'

 export const addFriendBothWays = async (friendEmail) =>{
    try {
        const ORIGIN = process.env.REACT_APP_ORIGIN
        const token = await getToken()

        //If token does not exist
        if(!token){
            return {message:"The user is not Authenticated",success:false}
        }

        const response = await axios.post(`${ORIGIN}/addFriendBothWays`,{
            friendEmail:friendEmail
        },
        {
            headers:{"Authorization":`Bearer ${token}`}
        })
        
        if(!response || !response.data.success){
            return {message:"Could not add as Friend",success:false}
        }

        return {message:"Added as a Friend",success:true}

    } catch (error) {
        return {message:"Could not add as Friend",success:false}
    }
 }