import { Route,Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import MainPage from './components/MainPage';


function App() {
  return (
    <>
    <Routes>
      <Route exact path='/' element={<HomePage />}>
        <Route exact path='/main' element={<MainPage />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
