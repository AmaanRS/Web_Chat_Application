import { json, redirect, useActionData } from 'react-router-dom';
import Home from '../components/Home';
import axios from 'axios';
import Cookies from 'js-cookie';

const HomePage = () => {
  const action = useActionData()

  return (
    <>
    <Home />
    {action && action.message && <p>{action.message}</p>}
    </>
  )
}

export const homeAction = async ({request,params}) =>{
  const data =await request.formData()
  const email = data.get("email")
  const password = data.get("password")
  const username = data.get("username")

  const ORIGIN = process.env.REACT_APP_ORIGIN

  //If both email and password exists
  if(email && password){

    //Username exist so its signup
    if(username){
      const response = await axios.post(`${ORIGIN}/signup`,
      {
        email,password,username
      })

      if(!response.data.success){
        return json({message:response.data.message})
      }

      return json({message:response.data.message})

    }else{
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

      Cookies.set('token', response.data.token, { expires: 1, path: '/'});

      return redirect("/main")
    }
  }else{
    return json({message:"Enter both username and password"})
  }
}

export default HomePage
