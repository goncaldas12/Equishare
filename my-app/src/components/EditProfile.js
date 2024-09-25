import React, { useState, useEffect } from "react";
import './EditProfile.css';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    fotoPerfil: '',
    nombreCompleto: '',
    nombreUsuario: '',
    email: ''
  });
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [error, setError] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Obtener currentUser desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Cargar los datos del perfil desde currentUser si existe
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fotoPerfil: currentUser.fotoPerfil || '',
        nombreCompleto: currentUser.nombreCompleto || '',
        nombreUsuario: currentUser.nombreUsuario || '',
        email: currentUser.email || ''
      });
      setOriginalProfileData({
        ...currentUser
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setIsSaveDisabled(JSON.stringify(profileData) === JSON.stringify(originalProfileData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
          fotoPerfil: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
    setIsSaveDisabled(false);
  };

  const handleClearProfilePicture = () => {
    setProfileData((prevData) => ({
      ...prevData,
      fotoPerfil: '' 
    }));
    setIsSaveDisabled(false);
  };

  const handleSave = () => {
    if (currentUser) {
      if (isUsernameOrEmailTaken()) {
        setError('El nombre de usuario o el email ya están en uso.');
        return;
      }
  
      // Crear un objeto del perfil sin la contraseña
      const { contrasena, ...profileWithoutPassword } = profileData;
  
      // Actualizar currentUser en localStorage
      const updatedCurrentUser = {
        ...currentUser,
        ...profileWithoutPassword
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  
      // Actualizar usuarios en localStorage
      updateUserInUsers(updatedCurrentUser);
  
      // Actualizar el estado de los datos originales para desactivar el botón de guardar
      setOriginalProfileData(profileData);
      alert('Perfil actualizado con éxito.');
      setIsSaveDisabled(true);
  
      // Disparar el evento de actualización de perfil si es necesario
      window.dispatchEvent(new Event('profileUpdate'));
    } else {
      alert('No se puede actualizar el perfil. Usuario no autenticado.');
    }
  };
  
  const updateUserInUsers = (updatedProfile) => {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const updatedUsers = storedUsers.map(user =>
      user.email === currentUser.email ? { ...user, ...updatedProfile } : user
    );
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
  };

  const isUsernameOrEmailTaken = () => {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    return storedUsers.some(user => 
      (user.nombreUsuario === profileData.nombreUsuario && user.email !== currentUser.email) || 
      (user.email === profileData.email && user.email !== currentUser.email)
    );
  };

  // Funciones de cambio de contraseña
  const handlePasswordChange = () => {
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const currentStoredUser = storedUsers.find(user => user.email === currentUser.email);

    if (passwordData.currentPassword !== currentStoredUser.contrasena) {
      setPasswordError('La contraseña actual es incorrecta.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }

    // Actualizar la contraseña
    const updatedUsers = storedUsers.map(user =>
      user.email === currentUser.email ? { ...user, contrasena: passwordData.newPassword } : user
    );
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));

    setPasswordError('');
    alert('Contraseña actualizada con éxito.');
    setIsPasswordChanging(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="edit-profile">
      <h2>Editar Perfil</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-picture-section">
        <h3>Foto de Perfil</h3>
        <div className="profile-picture-wrapper">
          {profileData.fotoPerfil ? (
            <img src={profileData.fotoPerfil} alt="Foto de perfil" className="profile-picture" />
          ) : (
            <div className="placeholder-picture">Sin Foto</div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button className="clear-picture-btn" onClick={handleClearProfilePicture}>
          Borrar Foto de Perfil
        </button>
      </div>

      <div className="input-section">
        <label>Nombre Completo</label>
        <input
          type="text"
          name="nombreCompleto"
          value={profileData.nombreCompleto}
          onChange={handleChange}
        />
      </div>

      <div className="input-section">
        <label>Nombre de Usuario</label>
        <input
          type="text"
          name="nombreUsuario"
          value={profileData.nombreUsuario}
          onChange={handleChange}
        />
      </div>

      <div className="input-section">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
        />
      </div>

      <button 
        className="save-btn" 
        onClick={handleSave}
        disabled={isSaveDisabled}
      >
        Guardar Cambios
      </button>

      {/* Botón para cambiar la contraseña */}
      <button className="change-password-btn" onClick={() => setIsPasswordChanging(!isPasswordChanging)}>
        Cambiar Contraseña
      </button>

      {isPasswordChanging && (
        <div className="password-change-section">
          <div className="input-section">
            <label>Contraseña Actual</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          <div className="input-section">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          <div className="input-section">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordFieldChange}
            />
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
          <button className="confirm-btn" onClick={handlePasswordChange}>
            Confirmar Cambio de Contraseña
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
