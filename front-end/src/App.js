import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Modules from './pages/Modules';
import Header from './components/Header';
import AddModules from './pages/AddModules';
import Home from './pages/Home'
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Profile from './pages/profile';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={
            <>
              <Header />
              <Routes>
                <Route path='/Login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/Modules' element={<PrivateRoute><Modules /></PrivateRoute>} />
                <Route path='/AddModules' element={<PrivateRoute><AddModules/></PrivateRoute>} />
                <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path='/Profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
              <Footer />
            </>
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;