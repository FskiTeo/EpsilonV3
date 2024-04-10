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

    const logout = async () => {
        const response = await fetch('api/user/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
    
        if (response.ok) {
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            console.error('Logout failed');
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
                </ul>
            </nav>
            <div>
                <li onClick={() => handleMenuItemClick('/login')} className='button-55' >Login</li>
                <li onClick={logout} className='button-55' >Log Out</li>
                <li onClick={() => handleMenuItemClick('/register')} className='button-55' >Register</li>
            </div>
        </header>
    );
};

export default Header;
