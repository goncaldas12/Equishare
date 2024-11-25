import React, { useState } from 'react';
import './PasswordRecovery.css';

const PasswordRecovery = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRecoverPassword = () => {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const userIndex = storedUsers.findIndex(user => user.nombreUsuario === username);

    if (userIndex === -1) {
      setError('El nombre de usuario no existe.');
      setMessage('');
      return;
    }

    if (newPassword !== repeatPassword) {
      setError('Las contraseñas no coinciden.');
      setMessage('');
      return;
    }

    // Actualizar la contraseña
    storedUsers[userIndex].contrasena = newPassword;
    localStorage.setItem('usuarios', JSON.stringify(storedUsers));

    setMessage('Contraseña actualizada con éxito.');
    setError('');
    setUsername('');
    setNewPassword('');
    setRepeatPassword('');
  };

  return (
    <div className='recu'>
      <h2>Recuperar Contraseña</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="input-section">
        <label>Nombre de Usuario</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="input-section">
        <label>Nueva Contraseña</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
      </div>

      <div className="input-section">
        <label>Repetir Contraseña</label>
        <input
          type="password"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
        />
      </div>

      <button className="confirm-btn" onClick={handleRecoverPassword}>
        Recuperar Contraseña
      </button>
    </div>
  );
};

export default PasswordRecovery;
