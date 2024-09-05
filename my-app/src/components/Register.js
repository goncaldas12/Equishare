import React from 'react';
import './Register.css';
import Footer from './Footer';

const Register = () => {
  return (
    <div>
        <div className="register-page">
          <h2>Registro</h2>
          <form>
            <label>
              Nombre Completo:
              <input type="text" name="name" />
            </label>
            <label>
              Email:
              <input type="email" name="email" />
            </label>
            <label>
              Nombre de Usuario:
              <input type="text" name="user" />
            </label>
            <label>
              Contraseña:
              <input type="password" name="password" />
            </label>
            <label>
              Repetir Contraseña:
              <input type="password" name="password-rep" />
            </label>
            <button type="submit">Registrarse</button>
          </form>
        </div>
        <Footer />
      </div>
  );
}

export default Register;
