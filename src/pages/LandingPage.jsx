import React from 'react';
import Navbar from '../components/Navbar';
import bg from '../assets/bg.jpg';

function LandingPage({ children }) {
  return (
    <div className="w-full h-full flex justify-center">
      <Navbar />
      
      {/* Background Image Container */}
      <div
        style={{ backgroundImage: `url(${bg})` }}
        className="w-full h-full flex flex-col justify-center overflow-y-scroll bg-cover bg-center bg-no-repeat relative"
      >
        {/* Overlay to Darken Background */}

        {/* Content - Ensure it is above the overlay */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

export default LandingPage;
