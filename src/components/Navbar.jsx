import React from 'react';
import logo from "../assets/logo.png";
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.includes('admin');

  return (
    <div className='w-full z-50  bg-white  fixed top-0 flex flex-row justify-between items-center border-b border-slate-300 drop-shadow py-3 px-10'>
      <div className='flex flex-row items-center gap-2'>
        <img src={logo} className='h-16' alt="logo" />
        <span className='text-xl text-slate-600 max-sm:hidden  '>St Louis Senior High School</span>
      </div>

      <div className='h-full flex items-center gap-5 justify-center'>
        <Link 
          to="/" 
          className={`text-xl max-sm:text-sm  h-full cursor-pointer ${
            !isAdminRoute ? 'border-b-2 border-green-700 text-green-600' : 'text-green-600'
          }`}
        >
          Fill Forms
        </Link>
        <Link 
          to="/admin-login" 
          className={`text-xl h-full  max-sm:text-sm  cursor-pointer ${
            isAdminRoute ? 'border-b-2 border-green-700 text-green-600' : 'text-green-600'
          }`}
        >
          Admin
        </Link>
      </div>
    </div>
  );
}

export default Navbar;