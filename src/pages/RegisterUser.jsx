import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc ,getFirestore, collection, getDocs,updateDoc ,} from "firebase/firestore";
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail,updatePassword, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
import Modal from 'react-modal'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
function RegisterUser() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [Success,setSuccess]=useState()

     const [showPasswordModal, setShowPasswordModal] = useState(false);
      const [newPassword, setNewPassword] = useState("");
      
      const [confirmPassword, setConfirmPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [passowrderros,setPasswordErrors]=useState()
      const [passwordSuccess,setPasswordSuccess]=useState()
      const [loadingpassword,setPasswordChangeloading]=useState(false)
      const [currentPassword, setCurrentPassword] = useState("");
      const [showOldPassword, setShowOldPassword] = useState(false);
      
      const [superAdmin,setSuperAdmin]=useState(false)
  

       const handleChangePassword = async () => {
            if (newPassword.length < 6) {
              setPasswordErrors("Password must be at least 6 characters.");
              return;
            }
            if (newPassword !== confirmPassword) {
              setPasswordErrors("Passwords do not match!");
              return;
            }
            if (!currentPassword) {
              setPasswordErrors("Please enter your current password.");
              return;
            }
          
            try {
              setPasswordChangeloading(true);
          
              // Create credentials using current email & password
              const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          
              // Re-authenticate the user
              await reauthenticateWithCredential(auth.currentUser, credential);
          
              // Now update the password
              await updatePassword(auth.currentUser, newPassword);
          
              // Optionally update Firestore (if storing passwordChanged status)
              await updateDoc(doc(db, "users", user.id), { passwordChanged: true });
          
              setShowPasswordModal(false);
              setPasswordSuccess("Password updated successfully!");
              setPasswordErrors(""); // Clear errors if successful
              setConfirmPassword("");
              setNewPassword("");
              setCurrentPassword("");
          
              setTimeout(() => {
                navigate(0); // Refresh the page
              }, 1000);
              
            } catch (error) {
              console.error("Error updating password:", error);
              setPasswordChangeloading(false);
              
              if (error== "FirebaseError: Firebase: Error (auth/invalid-credential).") {
                setPasswordErrors("Incorrect old password. Try again.");
              } else if (error == "auth/too-many-requests") {
                setPasswordErrors("Too many failed attempts. Try again later.");
              } else {
                setPasswordErrors("Failed to update password. Try again.");
              }
            } finally {
              setPasswordChangeloading(false);
            }
          };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);

      } else {
        navigate('/admin-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
            console.log(uid)
            try {
              const userDoc = await getDocs(collection(db, "users"));
              let userData = null;
        
              console.log(userDoc)
          
              userDoc.forEach((doc) => {
                if (doc.id === uid) {
                  userData = { id: doc.id, ...doc.data() };
                  console.log(userData)
                }
              });
              if (userData) {
               console.log(userData)
                setUser(userData);
                if (!userData.passwordChanged) {
                  setShowPasswordModal(true);
                }
        
                if (userData.isSuperAdmin) {
                  console.log(userData.isSuperAdmin)
                  setSuperAdmin(true);
                }
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const registerUser = async (email, password, e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        password:password,
        passwordChanged:false,

        createdAt: new Date(),
      });

      console.log("User saved to Firestore!");
      setSuccess("Admin added successfully ")
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex gap-3 justify-between items-center mb-2 pb-3 mt-3 px-4 border-b relative">
        <Link to='/admin-dashboard' className="text-2xl font-bold text-slate-800">Admin Dashboard</Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-slate-700 hover:text-green-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>


<Modal 
        isOpen={showPasswordModal} 
        className="bg-white p-10 rounded-lg shadow-lg mx-auto relative z-50 max-sm:mx-4 "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        shouldCloseOnOverlayClick={false} 
        shouldCloseOnEsc={false}



      >

{
  passowrderros&&
  <div id="alert-2" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div class="ms-3 text-sm font-medium">
  {passowrderros}
  </div>
  <button  onClick={()=>{setPasswordErrors()}} type="button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
    <span  class="sr-only">Close</span>
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
</div>
}


{
  passwordSuccess&&
  <div id="alert-3" class="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div class="ms-3 text-sm font-medium">
  {passwordSuccess}
  </div>
  <button  onClick={()=>{setPasswordSuccess()}} type="button" class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-3" aria-label="Close">
    <span class="sr-only">Close</span>
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
</div>
}

        <h2 className="text-xl  font-semibold mb-4 mt-">Change Your Password</h2>
        <p className="text-base text-gray-600 mb-6 ">You must reset your password before proceeding.</p>
        
        <div className="relative mb-4">
        <input 
          type={showOldPassword ? "text" : "password"} 
          placeholder="Enter  old  password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button 
          onClick={() => setShowOldPassword(!showOldPassword)} 
          className="absolute right-3 top-2 text-gray-600"
        >
          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
        {/* New Password Field */}
        <div className="relative mb-1">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter new password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-3 top-2 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className='mb-2 text-sm '>Password should be at least 6 characters</div>

        {/* Confirm Password Field */}
        <div className="relative mb-10">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirm new password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className="absolute right-3 top-2 text-gray-600"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

       
        <button
               onClick={handleChangePassword} 
                disabled={loadingpassword}
                className='w-full flex flex-row gap-4 justify-center rounded-md text-white transition duration-300 hover:bg-green-800 bg-green-700 text-center font-semibold text-base py-3 disabled:bg-green-400'
              >
                {loadingpassword ? <div className='flex flex-row gap-4 justify-center items-center'> <div className="spinner mx-3"></div> <span>Updating...</span></div> : "Update"}
              </button>

              <div className='w-full text-end  text-sm mt-2 '>

              don't want to Change passowrd? <span className='hover:underline text-red-700 cursor-pointer' onClick={handleLogout}>logout here </span>



              </div>
      </Modal>



        <div className="hidden md:flex justify-center items-center gap-4">
          <span className="font-semibold text-base cursor-pointer text-slate-700 hover:text-green-700">Add Admin</span>
          <Link to='/admin-users' className='font-semibold text-base cursor-pointer hover:text-green-700 text-slate-700'>Admin list</Link>
          <span className='text-sm'>Logged in as: {user && user.email}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </div>
      </div>


      <div className='flex items-center justify-center mt-10'>
        <form className='flex flex-col py-10 w-[50%] px-6 border rounded' onSubmit={(e) => registerUser(email, password, e)}>

        {
            Success&&
            <div id="alert-3" class="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div class="ms-3 text-sm font-medium">
  {Success}
  </div>
  <button onClick={()=>{setSuccess()}} type="button" class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-3" aria-label="Close">
    <span class="sr-only">Close</span>
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
</div>
            }


            {error && 
                <div id="alert-2" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span class="sr-only">Info</span>
  <div class="ms-3 text-sm font-medium">
  {error}
  </div>
  <button onClick={()=>{setError()}} type="button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
    <span class="sr-only">Close</span>
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  </button>
</div>}



        <div className='text-2xl text-gray-700 text-center  py-5 '>
        Add New Admin

        </div>
          <div className='mb-6'>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-gray-50 border-b-2 border-gray-300 focus:outline-none focus:border-green-800 peer"
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

          <div className='mb-10'>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-gray-50 border-b-2 border-gray-300 focus:outline-none focus:border-green-800 peer"
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

          <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded w-full" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;
