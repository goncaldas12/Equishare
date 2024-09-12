import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import avatar from '../images/avatar-default.png'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== passwordRep) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Validar si ya existe un usuario con el mismo nombre de usuario o email
    const userExists = storedUsers.some(user => user.nombreUsuario === username || user.email === email);
    if (userExists) {
      alert('El nombre de usuario o el correo ya están en uso.');
      return;
    }

    // Generar un ID único para el usuario
    const newUserId = Date.now().toString();

    const newUser = {
      id: newUserId,  // Asignar el ID único al nuevo usuario
      nombreCompleto: name,
      email: email, 
      nombreUsuario: username,
      contrasena: password,
      proyectos: [],
      fotoPerfil: avatar 
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));  // Guardar el usuario registrado como el usuario actual

    alert('Usuario registrado con éxito');
    navigate('/home');  // Redirigir a la página principal tras el registro
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
