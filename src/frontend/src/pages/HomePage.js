import { json, redirect, useActionData, useLoaderData, useNavigate } from 'react-router-dom';
import Home from '../components/Home';
import axios from 'axios';
import Cookies from 'js-cookie';
import { isLogin } from '../utils/Auth';
import { useEffect } from 'react';

const HomePage = () => {
  const action = useActionData()
  const { success } = useLoaderData()
  const navigate = useNavigate()

  //If user is logged in then redirect the user to main page
  useEffect(()=>{
    if(success){
      return navigate("/main",{replace:true})
    }
  },[success])

  return (
    <>
    { !success && <Home />}
    {action && action.message && <p>{action.message}</p>}
    </>
  )
}

export const homeAction = async ({request,params}) =>{

  //Get the data from the form submitted
  const data =await request.formData()
  const email = data.get("email")
  const password = data.get("password")
  const username = data.get("username")

  const ORIGIN = process.env.REACT_APP_ORIGIN

  //If both email and password exists
  if(email && password){

    //Username exist so its signup
    if(username){
      try {
        
        const response = await axios.post(`${ORIGIN}/signup`,
        {
          email,password,username
        })

        if(!response.data.success){
          return json({message:response.data.message})
        }

        return json({message:response.data.message})

      } catch (error) {

        return json({message:"There has been an error in creating your profile"})

      }
    }
    //This code is of login
    else{
      try {

        const response = await axios.post(`${ORIGIN}/login`,
        {
          email,password
        })

        if(!response.data.success){
          return json({message:response.data.message})
        }

        if(!response.data.token){
          return json({message:"User not logged in"})
        }

        //If the credentials are correct the set the jwt token as cookie
        Cookies.set('token', response.data.token, { expires: 1, path: '/'});

        return redirect("/main")
      } catch (error) {

          return json({message:"There has been an error in logging in"})
      }
    }
  }else{
    return json({message:"Enter both username and password"})
  }
}

export const homeLoader = async ({request})=>{
  try {
    const login = await isLogin()
    return {success:login}
  } catch (error) {
    return {success:false}
  }
}

export default HomePage
