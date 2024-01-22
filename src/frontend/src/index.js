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

const router = createBrowserRouter(
  createRoutesFromElements(
  <Route 
  path= "/"
  element={<HomePage/>}
  action={
    async({request}) => {
      switch(request.method){
        case "POST":{
          //Get the submitted form data
          let formData = await request.formData()
          let email = formData.get("email")
          let password = formData.get("password")
          let username = formData.get("username")

          if(username){
            //Username is not null hence the user is trying to signup
            axios.post("/signup",{

              email:email,
              username:username,
              password:password

            }).then(()=>{
              //Response from backend
              return null
            })
          }else{
            //Username is null and hence user is trying to login
            axios.post("/login",{

              email:email,
              password:password

            }).then((data)=>{
              //Response from backend
              console.log(data.message)
              return null

            })
          }
        }
      }
    }
  }
  errorElement={<ErrorPage/>}
  />
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
