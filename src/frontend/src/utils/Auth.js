import Cookies from 'js-cookie';
import axios from 'axios'

export const isLogin = async () =>{
    const ORIGIN = process.env.REACT_APP_ORIGIN
    try {
        const token = Cookies.get("token")

        //If token does not exist
        if(!token){
            return false;
        }

        //There is an empty object set because the headers should be set in third parameters in axios
        const response = await axios.post(`${ORIGIN}/main`,{},{
            headers:{"Authorization":`Bearer ${token}`}
        })

        //If response does not exist
        if(!response){
            return false;
        }

        //If response is false that means token exists but is not valid i.e it is changed or fake
        if(!response.data.success){
            Cookies.remove("token",{ expires: 1, path: '/'})
            return false
        }
        
        return true;
    } catch (error) {

        console.log(error)
        return false
    }
}

export const getToken = async ()=>{
    try {
        const token = Cookies.get("token")

        //If the token does not exist
        if(!token){
            return false
        }

        //Checks if token is not tampered with
        const isTokenAuthentic = await isLogin()

        if(!isTokenAuthentic){
            return false
        }

        return token
    }catch(error){

        console.log(error)
        return false
    }
}

