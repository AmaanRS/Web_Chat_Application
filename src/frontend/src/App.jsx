import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPages/ErrorPage';
import { homeAction,homeLoader } from './pages/HomePage';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import { mainLoader } from './pages/MainPage'
import AddFriendPage from './pages/AddFriendPage'
import { addFriendLoader } from './pages/AddFriendPage';

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
        {
          path:"addFriend",
          element:<AddFriendPage/>,
          loader:addFriendLoader
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
