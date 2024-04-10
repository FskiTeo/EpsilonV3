import React, { useState } from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import LogoEpsi  from '../assets/epsiLogo.png'

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuItemClick = (route) => {
        navigate(route);
        setIsMenuOpen(false);
    };

    const isLoggedIn = () => {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('isLoggedIn'))
          .split('=')[1];
        return cookieValue === 'true';
      };

    const logout = async () => {
        const response = await fetch('/api/user/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      
        if (response.ok) {
          document.cookie = "isLoggedIn=false; path=/";
          navigate('/login');
        } else {
          const responseData = await response.json();
          console.error('Logout failed:', responseData);
        }
      };

      return (
        <header className="header">
            <div onClick={() => handleMenuItemClick('/')}>
                <img className='logo' src={LogoEpsi} alt='' /></div>
            <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ul className='ul'>
                    <li className='button-55 li' onClick={() => handleMenuItemClick('/')}>Home</li>
                    <li className='button-55 li' onClick={() => handleMenuItemClick('/Modules')}>Module</li>
                    <li className='button-55 li' onClick={() => handleMenuItemClick('/AddModules')}>Add Module</li>
                    <li className='button-55 li' onClick={() => handleMenuItemClick('/Profile')}>Profile</li>
                </ul>
            </nav>
            <div>
                {!isLoggedIn() && <li onClick={() => handleMenuItemClick('/login')} className='button-55' >Login</li>}
                {isLoggedIn() && <li onClick={logout} className='button-55' >Log Out</li>}
                {!isLoggedIn() && <li onClick={() => handleMenuItemClick('/register')} className='button-55' >Register</li>}
            </div>
        </header>
    );
};

export default Header;
