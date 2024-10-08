import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar2.css';
import logo from '../images/E (2).png';
import defaultProfilePic from '../images/avatar-default.png'; 

const Navbar2 = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleProfileUpdate = () => {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      setCurrentUser(storedUser);
    };

    window.addEventListener('profileUpdate', handleProfileUpdate);

    
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Actualizar los proyectos del usuario actual en localStorage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map(user =>
      user.email === currentUser.email ? { ...user, proyectos: currentUser.proyectos } : user
    );

    
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Remover el currentUser de localStorage
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    onLogout(); 
    navigate('/');
  };

  return (
    <nav className="navbar2">
      <Link to="/home">
        <img src={logo} alt="Logo" className="navbar-imagen" />
      </Link>

      <div className="d-grid2">
        {currentUser && (
          <div className="profile-section" ref={dropdownRef}>
            <span className="user-name" onClick={toggleDropdown}>{currentUser.nombreUsuario}</span> {/* Mostrar el nombre de usuario */}
            <img 
              src={currentUser.fotoPerfil || defaultProfilePic} 
              alt="Foto de perfil" 
              className="profile-image-small" 
              onClick={toggleDropdown} 
            />
        
            {isDropdownOpen && (
              <div className="dropdown-menu dropdown-teams">
                <Link to="projects" className="dropdown-item">Archivados</Link>
                <Link to="edit-profile" className="dropdown-item">Editar perfil</Link>
                <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button> 
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;
