import React from 'react';
import { Outlet} from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout2 = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout2;
