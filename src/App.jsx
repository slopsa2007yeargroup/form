
import './App.css'
import LandingPage from './pages/LandingPage'
import Form from './components/Form';
import AdminPage from './components/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; 
import ResponseDetail from './pages/ResponseDetail';
import NotFound from './pages/Notfound';
import RegisterUser from './pages/RegisterUser';

import AdminUsersPage from './pages/AdminUserList.JSX';
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-10 flex justify-center items-center h-full gap-10"><div className='spinner2'></div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

function App() {

  return (
    <div className='w-full h-screen '>
    <Routes>
      <Route path='/' element={<LandingPage><Form/></LandingPage>}/>
      <Route path='/admin-login' element={<LandingPage><AdminPage/></LandingPage>}/>
      <Route path="*" element={<NotFound />} />

      <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route         
         path="/response/:id" 
          element={
            <ProtectedRoute>
              <ResponseDetail />
            </ProtectedRoute>
          }  />

<Route path="/admin-users" element={
      <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>} />




            <Route path="/add-admin" element={
      <ProtectedRoute>
              <RegisterUser />
            </ProtectedRoute>} />

    </Routes>
  
    </div>
  )
}

export default App
