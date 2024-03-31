import React, { useEffect } from 'react'
import AddFriend from '../components/AddFriendComponents/AddFriend'
import { isLogin } from '../utils/Auth'
import { useLoaderData, useNavigate } from 'react-router-dom'

const AddFriendPage = () => {
    const { success } = useLoaderData()
    const navigate = useNavigate()

    //If user is logged in then redirect the user to main page
    useEffect(()=>{
      if(!success){
        return navigate("/",{replace:true})
      }
    },[success])
  return (
    <>
        {success && <AddFriend/>}
    </>
  )
}

export const addFriendLoader = async ({request}) =>{
    const login = await isLogin()
    return {success:login}
}

export default AddFriendPage
