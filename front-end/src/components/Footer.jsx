import React from 'react';
import '../css/Footer.css';

function Footer() {
return (
    <footer className="footer">
        <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
        </div>
        <ul className="menu">
            <li className="menu__item"><a className="menu__link" href="/">Home</a></li>
            <li className="menu__item"><a className="menu__link" href="/about">About</a></li>
            <li className="menu__item"><a className="menu__link" href="/services">Services</a></li>
            <li className="menu__item"><a className="menu__link" href="/team">Team</a></li>
            <li className="menu__item"><a className="menu__link" href="/contact">Contact</a></li>
        </ul>
        <p>&copy; 2024 Epsilon | All Rights Reserved</p>
    </footer>
);
}

export default Footer;
