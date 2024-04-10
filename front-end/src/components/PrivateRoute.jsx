import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const cookies = document.cookie.split('; ');
  const isLoggedInCookie = cookies.find(row => row.startsWith('isLoggedIn'));
  const isAuthenticated = isLoggedInCookie ? isLoggedInCookie.split('=')[1] === 'true' : false;
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;