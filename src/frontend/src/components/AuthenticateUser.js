import React,{useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'


export const AuthenticateUser = ({children}) => {
    const ORIGIN = process.env.REACT_APP_ORIGIN
    const [user,setUser] = useState(false)

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                await axios.post(`${ORIGIN}/main`).then((data)=>{
                    if(data.data.success){
                        setUser(true)
                    }
                })
            } catch (error) {
                console.error('Error during authentication: in AuthenticateUser', error);
            }
        }
        fetchData()
    },[])

    if(!user){
       return  <Navigate to="/" />;
    }
    return <>{children}</>

}

