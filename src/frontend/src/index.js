import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import HomePage from "./components/HomePage"
import ErrorPage from "./components/ErrorPage"
import axios from "axios"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  createRoutesFromElements
} from "react-router-dom"

const ORIGIN = process.env.REACT_APP_ORIGIN


const handleLoginAndSignup = async (request)=>{
  switch(request.method){
    case "POST":{
      //Get the submitted form data
      let formData = await request.formData()
      let email = formData.get("email")
      let password = formData.get("password")
      let username = formData.get("username")

      if(username){
        //Username is not null hence the user is trying to signup
        await axios.post(`${ORIGIN}/signup`,{

          email:email,
          username:username,
          password:password

        }).then((data)=>{
          //Response from backend
          console.log(data.data.message)
          return null
        }).catch((err)=>{
          if(err){
            console.log(err.message)
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
          return null

        }).catch((err)=>{
          if(err){
            console.log(err.message)
            //Return error for error page
            return err 
          }
        })
      }
    }
  }
}




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<HomePage />}
      action={async ({ request }) => await handleLoginAndSignup(request)}
      errorElement={<ErrorPage />}
    />
  )
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
