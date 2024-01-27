import { Route,Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import MainPage from './components/MainPage';
import { AuthenticateUser } from './components/AuthenticateUser';


function App() {
  return (
    <>
    <Routes>
      <Route exact path='/' element={<HomePage />}>
      </Route>
        <Route exact path='/main' element={
          <AuthenticateUser>
            <MainPage />
          </AuthenticateUser>
        } 
        />
    </Routes>
    </>
  );
}

export default App;
