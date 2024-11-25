import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../api/login.api'; // Supongamos que tienes este servicio configurado
import './Login.css';
import { fetchUsuarioByEmail } from '../api/usuarios.api';

const Login = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Llamar al endpoint de login en el backend
    let response = await login(email, password);

    if (response.status === 200) {
      // Guardar el token de acceso en sessionStorage
      sessionStorage.setItem('access-token', response.token); 
      const usuarioData = await fetchUsuarioByEmail(email);
      sessionStorage.setItem("idUsuario", usuarioData.idUsuario);
      sessionStorage.setItem('currentUserEmail', email); 


      console.log("Token generado y almacenado:", response.token);

      // Redirigir al usuario a la página principal
      navigate('/home');
    } else {
      setError(response.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="divv">
          <h2>Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="********"
              required
            />
          </div>
          <div className="extra-links">
            <a href="/password-recovery">¿Olvidaste tu contraseña?</a>
          </div>
          {error && (
            <p className="text-red-700 font-bold text-center">{error}</p>
          )}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
