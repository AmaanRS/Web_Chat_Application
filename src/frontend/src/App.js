import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage, { homeAction } from './pages/HomePage';
import ErrorPage from './pages/ErrorPage'
import MainPage from './pages/MainPage';
import AddFriendPage from './pages/AddFriendPage'
import {mainLoader} from './pages/MainPage'
import {homeLoader} from './pages/HomePage'
import {addFriendLoader} from './pages/AddFriendPage'

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      // element:<HomePage />,
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
  );
}

export default App;
