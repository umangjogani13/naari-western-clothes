import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <main className="pt-[120px]">
          <Home />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;

