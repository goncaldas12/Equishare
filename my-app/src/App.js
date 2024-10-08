import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Features from './components/Features';
import Register from './components/Register';
import Login from './components/Login';
import PasswordRecovery from './components/PasswordRecovery';
import Layout1 from './components/Layout1';
import Layout2 from './components/Layout2';
import './App.css';
import Home from './components/Home';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';  // Importar el componente de detalles del proyecto
import EditProfile from './components/EditProfile';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Cargar el usuario actual desde localStorage si está logueado
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);  // Establecer el usuario actual
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);  // Limpiar el estado de usuario actual
  };

  return (
    <Router>
      <Routes>
        {/* Rutas bajo el Layout2 (Páginas Públicas) */}
        <Route path="/" element={<Layout2 />} >
          <Route index element={<><Header /><Features /></>} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/password-recovery" element={<PasswordRecovery />} /> 
        </Route>
        
        {/* Rutas bajo el Layout1 (Páginas Privadas) */}
        <Route path="/home" element={<Layout1 currentUser={currentUser} onLogout={handleLogout} />}> 
          <Route index element={<Home />} />
          <Route path="project/:projectId" element={<ProjectDetails />} /> 
          <Route path="projects" element={<Projects />} />
          <Route path="edit-profile" element={<EditProfile />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;