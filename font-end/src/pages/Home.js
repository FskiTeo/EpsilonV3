import React from 'react';
import '../css/Home.css'
import LogoEpsi from '../assets/epsiLogo.png'
import { useNavigate } from 'react-router-dom';
import '../css/Header.css'
import Background from '../components/background';

const Home = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/modules');
    }

    return (
        <div>
            <Background />
            <div className='home-content'>
                <h1 className='home-title'>Bienvenue sur Epsilon</h1>
                <p className='home-p'>Un site de partage de modules</p>
                <img className='home-img' src={LogoEpsi} alt="" />
                <button onClick={handleClick} class="button-55">Entrer</button>
            </div>
        </div>
    );
};

export default Home; 