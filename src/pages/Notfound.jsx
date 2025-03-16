import React from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/404.svg'; // Add an illustration

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={illustration} alt="404 Illustration" className="h-96 mb-3" />
      <p className="mt-4 text-xl text-gray-600 text-center ">Oops! Page not found.</p>
      <p className="text-sm text-gray-500 text-center">The page you're looking for doesn't exist or has been moved.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition duration-300"
      >
        Go back to fill form 
      </button>
    </div>
  );
}

export default NotFound;