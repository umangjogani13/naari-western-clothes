import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Home from './pages/Home';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[120px]">
        <Home />
      </main>
    </div>
  );
}

export default App;
