import axios from 'axios'
import {getToken} from './Auth'

export const getAllUsersEmail = async () =>{
    try {
        const ORIGIN = process.env.REACT_APP_ORIGIN
        const token = getToken()

        if(!token){
            return {message:"User is not Authenticated ",success:false}
        }

        const response = await axios.post(`${ORIGIN}/getAllUsersEmail`,{},{
            headers:{"Authorization" : `Bearer ${token}`}
        })

        const listOfAllEmails = response.data.listOfEmails
        
        if(!listOfAllEmails){
            return {message:"Cannot get  all users data",success:false}
        }

        return {message:"Fetched all emails successfully",success:true,listOfAllEmails:listOfAllEmails}

    } catch (error) {

        console.log(error)
        return {message:"Cannot get all users data",success:false}
    }
}