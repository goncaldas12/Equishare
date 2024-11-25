import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './Login.css';

const Login = () => {
  return (
    <div className='divv'>
    <h2>Iniciar Sesión</h2>
      <div className="login-container">
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" placeholder="Ingresa tu correo electrónico" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Ingresa tu contraseña" required />
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
          <div className="extra-links">
            <Link to="/password-recovery">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
