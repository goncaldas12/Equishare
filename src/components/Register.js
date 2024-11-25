import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { createUsuario, fetchUsuarioByEmail } from '../api/usuarios.api'; // Importar funciones de API

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');
  const [error, setError] = useState(null); // Estado para errores del backend
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Resetear errores previos

    if (password !== passwordRep) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const newUser = {
      nombreCompleto: name, // Asegúrate de que estos nombres coincidan con los campos en tu backend
      email: email,
      nombreUsuario: username,
      contrasena: password,
      fotoPerfil: null, // O el avatar predeterminado, si es necesario
    };

    try {
      // Llamar a la API para crear el usuario
      const response = await createUsuario(newUser);

      sessionStorage.setItem('access-token', response.token);

      // Guardar el email del usuario recién registrado en sessionStorage
      sessionStorage.setItem('currentUserEmail', response.usuario.email);

      // Opcional: Cargar datos completos del usuario y mostrarlos en el frontend
      const currentUser = await fetchUsuarioByEmail(response.usuario.email);

      alert(`Bienvenido, ${currentUser.nombreUsuario}. ¡Te has registrado con éxito!`);
      navigate('/home'); // Redirigir a la página principal
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="register-page">
      <h2>Registro</h2>
      <form onSubmit={handleRegister} className="register-form">
        <label>
          Nombre Completo:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Nombre de Usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Repetir Contraseña:
          <input type="password" value={passwordRep} onChange={(e) => setPasswordRep(e.target.value)} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
