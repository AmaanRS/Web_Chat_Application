import axios from 'axios'
import {getToken} from './Auth'

export const getAllUsersEmail = async () =>{
    try {
        const ORIGIN = import.meta.env.VITE_ORIGIN
        const token = await getToken()

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


export const getUserConversation = async (friendEmail)=>{
    const ORIGIN = import.meta.env.VITE_ORIGIN

    const token = await getToken()

    if(!token){
        return {message:"User is not Authenticated ",success:false}
    }

    if(!friendEmail){
        return {message:"Please send friendEmail",success:false}
    }

    const conversation = await axios.post(`${ORIGIN}/getUserConversation`,{friendEmail:friendEmail},
    {headers:{"Authorization" : `Bearer ${token}`}})

    if(!conversation){
        return {message:"There was aproblem while getting the conversation",success:false}
    }

    if(!conversation.data || !conversation.data.success){
        return {message:conversation.data.message,success:false}
    }

    return {message:conversation.data.message,success:true,conversation:conversation.data.conversation}

}


export const sendMessage = async (friendEmail,message)=>{
    const ORIGIN = import.meta.env.VITE_ORIGIN

    const token = await getToken()

    if(!token){
        return {message:"User is not Authenticated ",success:false}
    }

    if(!friendEmail){
        return {message:"Please send friendEmail",success:false}
    }

    const response = await axios.post(`${ORIGIN}/sendMessage`,{friendEmail:friendEmail,message:message},
    {headers:{"Authorization" : `Bearer ${token}`}})

    if(!response){
        return {message:"There was aproblem while getting the conversation",success:false}
    }

    return {message:"The was sent successfully",success:true}

}