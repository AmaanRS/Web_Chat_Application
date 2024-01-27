import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import {  BrowserRouter } from "react-router-dom"


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//     <Route
//       path="/"
//       element={<HomePage />}
//       action={async ({ request }) => await HandleLoginAndSignup(request)}
//       errorElement={<ErrorPage />}
//     >
//     </Route>
//     <Route
//     path='/main'
//     element={
//       <AuthenticateUser>
//         <MainPage />
//       </AuthenticateUser>
//     }
//     errorElement={<ErrorPage />}
//     />
//     </>
//   )
// );



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <App />
  </BrowserRouter>

);
