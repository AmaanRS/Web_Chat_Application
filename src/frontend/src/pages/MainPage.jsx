import { useEffect } from 'react'
import Main from "../components/MainComponents/Main"
import { getToken, isLogin } from '../utils/Auth'
import { useLoaderData, useNavigate } from 'react-router-dom'
import axios from 'axios'

const MainPage = () => {
  const { success } = useLoaderData()
  const navigate = useNavigate()

  //If the user is not logged in redirect the user to Home
  useEffect(()=>{
    if(!success){
      return navigate("/",{replace:true})
    }
  },[success])
  
  return (
    <>
      { success && <Main />}
    </>
  )
}

export const mainLoader =async ({request})=>{
  try {
    const ORIGIN = import.meta.env.VITE_ORIGIN
    const login = await isLogin()
    const token = await getToken()

    //If the token does not exist
    if(!token){
      return {success:false}
    }

    //Fetch the user's data from the database
    const response = await axios.post(`${ORIGIN}/getUserData`,{},{
      headers:{"Authorization":`Bearer ${token}`}
    })

    //If the response does not exist or if success is false
    if(!response || !response.data.success){
      return {success:false}
    }

    //If the email or friends is empty
    if(!response.data.email || !response.data.friends){
      return {success:false}
    }

    return {success:login,email:response.data.email,friends:response.data.friends}

  } catch (error) {
    
    console.log(error)
    return {success:false}
  }

}

export default MainPage
