import axios from 'axios';
import { redirect } from 'react-router-dom';

export const HandleLoginAndSignup = async (request)=>{
    const ORIGIN = process.env.REACT_APP_ORIGIN

    switch(request.method){
      case "POST":{
        //Get the submitted form data
        let formData = await request.formData()
        let email = formData.get("email")
        let password = formData.get("password")
        let username = formData.get("username")
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
        }
        //This value can be used in the HomePage using useActionData()
        // return "Hii"
        
        return success
      }
    }
  }