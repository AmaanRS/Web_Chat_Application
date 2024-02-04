import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage, { homeAction } from './pages/HomePage';
import ErrorPage from './pages/ErrorPage'
import MainPage from './pages/MainPage';

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
          action: homeAction
        },
        {
          path:"main",
          element:<MainPage />,

        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
