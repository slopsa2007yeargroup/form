import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/logo.png";

function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: "AIzaSyB9bt7BuGgsGjTCDul1741ISikWW4eG6yE",
    authDomain: "st-louis-app.firebaseapp.com",
    databaseURL: "https://st-louis-app-default-rtdb.firebaseio.com",
    projectId: "st-louis-app",
    storageBucket: "st-louis-app.firebasestorage.app",
    messagingSenderId: "688310246443",
    appId: "1:688310246443:web:a45feec486130523e29e6e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      console.error("Error logging in:", error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen max-xs:mt-60 flex justify-center items-center'>
      <div className='lg:w-[50%] md:w-[60%] sm:w-[70%] w-[90%] bg-white bg-opacity-70 border-slate-300 border rounded-md shadow flex flex-col py-10'>
        {error && (
          <div id="alert-border-2" className="mx-4 my-4 flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
            <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <div className="ms-3 text-sm font-medium">
              {error}
            </div>
            <button onClick={() => setError('')} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-2" aria-label="Close">
              <span className="sr-only">Dismiss</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
        )}

        <div className='flex justify-center items-center'>
          <img className='h-24' src={logo} alt="Logo" />
        </div>

        <div className='text-xl text-slate-600 text-center mb-10 mt-3'>Admin Login</div>

        <form onSubmit={handleLogin} className='flex flex-col px-6'>
          {/* Email Input */}
          <div className='mb-4'>
            <div className="relative">
              <input
                type="email"
                id="email"
                className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                Email
              </label>
            </div>
          </div>

          {/* Password Input */}
          <div className='mb-10'>
            <div className="relative">
              <input
                type="password"
                id="password"
                className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${error ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                Password
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-700 flex justify-center hover:bg-green-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={loading}
            >
              {loading ? (
                <div className='flex flex-row items-center justify-center gap-4'>
                  <div className='spinner mx-4'></div>
                  <span>Logging in...</span>
                </div>
              ) : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;