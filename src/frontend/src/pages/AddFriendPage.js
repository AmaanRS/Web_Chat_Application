import React from 'react'
import AddFriend from '../components/AddFriend'
import { isLogin } from '../utils/Auth'
import { useLoaderData } from 'react-router-dom'

const AddFriendPage = () => {
    const { success } = useLoaderData()
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
