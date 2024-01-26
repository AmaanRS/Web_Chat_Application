import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from "./components/HomePage"
import ErrorPage from "./components/ErrorPage"
import MainPage from './components/MainPage';
import { AuthenticateUser } from './components/AuthenticateUser';
import { HandleLoginAndSignup } from './components/HandleLoginAndSignup'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route
      path="/"
      element={<HomePage />}
      action={async ({ request }) => await HandleLoginAndSignup(request)}
      errorElement={<ErrorPage />}
    >
    </Route>
    <Route
    path='/main'
    element={
      <AuthenticateUser>
        <MainPage />
      </AuthenticateUser>
    }
    errorElement={<ErrorPage />}
    />
    </>
  )
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
