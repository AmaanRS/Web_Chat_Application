import axios from 'axios';

//JWT Not working try alternatives
// import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

//When sending requests to server add these HEADERS

// import axios from 'axios';
// import Cookies from 'js-cookie';

// // Get the token from the cookie
// const token = Cookies.get('token');

// // Set the Authorization header in axios
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const HandleLoginAndSignup = async (request)=>{
    const ORIGIN = process.env.REACT_APP_ORIGIN
    const JWT_SECRET = process.env.REACT_APP_JWT_SECRET

    switch(request.method){
      case "POST":{
        //Get the submitted form data
        let email = request.email
        let password = request.password
        let username = request.username
        var success
  
        if(username){
          //Username is not null hence the user is trying to signup
          await axios.post(`${ORIGIN}/signup`,{  
            email:email,
            username:username,
            password:password
  
          }).then((data)=>{
            //Response from backend
            console.log(data.data.message)
            success = data.data.success
  
          }).catch((err)=>{
            if(err){
              console.log(err.message)
              success = false
  
              //Return error for error page
              return err
            }
          })
        }else{
          //Username is null and hence user is trying to login
          await axios.post(`${ORIGIN}/login`,{  

            email:email,
            password:password
  
          }).then((data)=>{
            //Response from backend
            if(data.data.success){
              if(data.data.email){
                const token = jwt.sign(data.data.email,JWT_SECRET)
                Cookies.set('token', token, { expires: 1, path: '/' });
              }
            }
  
          }).catch((err)=>{
            if(err){
              console.log(err.message)
              success = false
  
              //Return error for error page
              return err 
            }
          })
        }
        //This value can be used in the HomePage using useActionData()
        // return "Hii"
        
        return success
      }
    }
  }