import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar2 from './Navbar2';

const Layout1 = ({ currentUser, onLogout }) => { // Recibir currentUser y onLogout como props
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar2 currentUser={currentUser} onLogout={onLogout} /> {/* Pasar currentUser y onLogout a Navbar2 */}
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout1;
