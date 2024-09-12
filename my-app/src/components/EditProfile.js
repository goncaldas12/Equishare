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
  const [error, setError] = useState(''); // Para mostrar mensajes de error

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
      fotoPerfil: '' // Restablecer a la foto por defecto
    }));
    setIsSaveDisabled(false);
  };

  const handleSave = () => {
    if (currentUser) {
      // Validar la unicidad del nombre de usuario y email
      if (isUsernameOrEmailTaken()) {
        setError('El nombre de usuario o el email ya están en uso.');
        return;
      }
      
      const { contrasena, ...profileWithoutPassword } = profileData; // Excluir contraseña

      // Guardar los cambios en currentUser en localStorage
      localStorage.setItem('currentUser', JSON.stringify(profileWithoutPassword));

      // Actualizar el usuario en el array 'usuarios'
      updateUserInUsers(profileWithoutPassword);

      setOriginalProfileData(profileData);
      alert('Perfil actualizado con éxito.');
      setIsSaveDisabled(true);

      // Forzar la actualización del Navbar2
      window.dispatchEvent(new Event('profileUpdate'));
    } else {
      alert('No se puede actualizar el perfil. Usuario no autenticado.');
    }
  };

  const updateUserInUsers = (updatedProfile) => {
    // Obtener usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Actualizar el usuario correspondiente en el array de usuarios
    const updatedUsers = storedUsers.map(user =>
      user.email === currentUser.email ? { ...user, ...updatedProfile } : user
    );

    // Guardar el array de usuarios actualizado en localStorage
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
  };

  const isUsernameOrEmailTaken = () => {
    // Obtener usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    return storedUsers.some(user => 
      (user.nombreUsuario === profileData.nombreUsuario && user.email !== currentUser.email) || 
      (user.email === profileData.email && user.email !== currentUser.email)
    );
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
    </div>
  );
};

export default EditProfile;
