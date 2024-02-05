import React, { useEffect,useState } from 'react'
import Main from '../components/Main'
import { isLogin } from '../utils/Auth'
import { useLoaderData, useNavigate } from 'react-router-dom'

const MainPage = () => {
  const login = useLoaderData()
  const navigate = useNavigate()

  //If the user is not logged in redirect the user to Home
  useEffect(()=>{
    if(!login){
      return navigate("/",{replace:true})
    }
  },[login])
  
  return (
    <>
      { login && <Main />}
    </>
  )
}

export const mainLoader =async ({request})=>{
  const login = await isLogin()
  return login
}

export default MainPage
