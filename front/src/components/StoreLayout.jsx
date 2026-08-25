import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const StoreLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <main className="pt-[120px]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StoreLayout;
