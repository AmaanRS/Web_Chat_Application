import Cookies from 'js-cookie';

export const isLogin = () =>{
    const token = Cookies.get("token")
    if(!token){
        return false;
    }
    return true;
}

