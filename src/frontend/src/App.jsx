import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPages/ErrorPage';
import { homeAction,homeLoader } from './pages/HomePage';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import { mainLoader } from './pages/MainPage'

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      errorElement:<ErrorPage />,
      action: homeAction,
      children:[
        {
          index:true,
          element:<HomePage/>,
          action: homeAction,
          loader:homeLoader
        },
        {
          path:"main",
          element:<MainPage />,
          loader:mainLoader
        },
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
