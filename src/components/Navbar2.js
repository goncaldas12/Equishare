import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar2.css';
import logo from '../images/E (2).png';
import defaultProfilePic from '../images/avatar-default.png';
import { fetchUsuarioByEmail } from '../api/usuarios.api'; // Importar función

const Navbar2 = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Obtener datos del usuario actual desde el backend
  const fetchCurrentUser = async () => {
    try {
      const email = sessionStorage.getItem('currentUserEmail'); // Usar email de sessionStorage
      if (!email) return;

      const user = await fetchUsuarioByEmail(email); // Llamar función de API
      setCurrentUser(user);
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
    sessionStorage.removeItem('currentUserEmail');
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
            <span className="user-name" onClick={toggleDropdown}>{currentUser.nombreUsuario}</span>
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
