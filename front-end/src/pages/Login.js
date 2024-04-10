import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TitleContact from '../components/TitleLogin.jsx';
import '../css/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
  
        if (response.ok) {
          navigate('/');
        } else {
          const responseData = await response.json();
          setErrorMessage(responseData.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    return (
        <div>
            <TitleContact />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}>
                <div className="container-login">
                    <form onSubmit={handleSubmit}>
                        <div className="inputs">
                            <label>Email</label>
                            <input type="email" placeholder="MaBite@me.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label>Password</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button className='button' type="submit">Envoyer</button>
                        </div>
                    </form>
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;