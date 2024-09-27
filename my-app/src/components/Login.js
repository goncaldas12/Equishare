import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

    const user = storedUsers.find(u => (u.nombreUsuario === username || u.email === username) && u.contrasena === password);

    if (user) {
      // Guardar al usuario actual en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/home');  
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="divv">
        <h2>Iniciar Sesión</h2>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Nombre de Usuario o Email:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>
      <div className="extra-links">
        <a href="/password-recovery">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  );
};

export default Login;
