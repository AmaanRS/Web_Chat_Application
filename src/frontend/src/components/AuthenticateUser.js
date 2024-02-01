import React,{useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';



export const AuthenticateUser = ({children}) => {
    const ORIGIN = process.env.REACT_APP_ORIGIN
    const [user,setUser] = useState(false)

        const fetchData = async()=>{
            try {
                const token = Cookies.get("token")

                if (!token) {
                    // No token found, user is not authenticated
                    setUser(false);
                    return;
                  }
                
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const data = await axios.post(`${ORIGIN}/main`)

                if(data.data.success){
                    setUser(true)
                    console.log(data.data.success)
                }
            
            } catch (error) {
                console.error('Error during authentication: in AuthenticateUser', error);
            }
        }
    useEffect(()=>{
        fetchData()
    },[])

    console.log(user)
    if(!user){
        return  <Navigate to="/" />;
    }
    return <>{children}</>

}

