import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className='titulo'>EquiShare</Link>
      <div className="d-grid">
        <Link to="/login">
          <button id="btn2" className="btn btn-primary" type="button">Iniciar Sesión</button>
        </Link>
        <Link to="/register">
          <button id="btn1" className="btn btn-primary" type="button">Registrarse</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

