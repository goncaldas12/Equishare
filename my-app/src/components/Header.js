import React from 'react';
import './Header.css';
import logo from '../images/E (2).png'; 

const Header = () => {
  return (
    <header>
      <div className="header-content">
        {}
        <img src={logo} alt="Imagen descriptiva" className="header-imagen" />
        <h1 id="titulo">Dividir gastos <br /> nunca fue tan fácil</h1>
      </div>
    </header>
  );
}

export default Header;
