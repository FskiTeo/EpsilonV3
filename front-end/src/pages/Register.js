import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TitleContact from '../components/TitleLogin.jsx';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudonyme, setPseudonyme] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          pseudonyme: pseudonyme
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
      navigate('/login');
    } catch (error) {
      console.error('There was an error!', error);
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
              <label>Pseudonyme</label>
              <input type="text" placeholder="Pseudonyme" value={pseudonyme} onChange={(e) => setPseudonyme(e.target.value)} />
              <button className='button' type="submit">Envoyer</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;