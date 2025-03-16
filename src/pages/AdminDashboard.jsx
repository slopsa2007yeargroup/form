import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, query, orderBy, deleteDoc, doc ,updateDoc} from "firebase/firestore";
import { auth, db } from '../firebase';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { CSVLink } from 'react-csv';
import { utils, write } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa';




function AdminDashboard() {
  const [formResponses, setFormResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        fetchUserData(currentUser.uid);

        fetchFormResponses();
      } else {
        navigate('/admin-login');
      }
    });

    return () => unsubscribe();
  }, []);



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
    
    if (error=="FirebaseError: Firebase: Error (auth/invalid-credential).") {
      setPasswordErrors("Incorrect old password. Try again.");
    } else if (error =="auth/too-many-requests") {
      setPasswordErrors("Too many failed attempts. Try again later.");
    } else {
      setPasswordErrors("Failed to update password. Try again.");
    }
  } finally {
    setPasswordChangeloading(false);
  }
};



  const fetchFormResponses = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "formResponses"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

      const responses = [];
      querySnapshot.forEach((doc) => {
        const timestamp = doc.data().timestamp?.toDate();
        const formattedDate = timestamp
          ? timestamp.toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "Unknown";

        responses.push({
          id: doc.id,
          ...doc.data(),
          timestamp: formattedDate,
        });
      });

      setFormResponses(responses);
      setFilteredData(responses);
      setError('');
    } catch (error) {
      console.error("Error fetching form responses:", error);
      setError('Failed to load form responses. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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
  
  useEffect(() => {
    const result = formResponses.filter(response => {
      return (
        response.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.houseDorm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(result);
  }, [searchTerm, formResponses]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const columns = [
    {
      name: <span className='text-base font-semibold text-slate-500'>First Name</span>,
      selector: row => `${row.firstName}`,
      sortable: true,
      cell: row => (
        <div>
          <div className="text-base font-semibold text-gray-700">{row.firstName}</div>
        </div>
      ),
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>Surname</span>,
      selector: row => `${row.surname}`,
      sortable: true,
      cell: row => (
        <div>
          <div className="text-base font-semibold text-gray-700">{row.surname}</div>
        </div>
      ),
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>Maiden Name</span>,
      selector: row => `${row.maidenName ? row.maidenName : ""}`,
      sortable: true,
      cell: row => (
        <div>
          <div className="text-base font-medium text-gray-700">{row.maidenName ? row.maidenName : ""}</div>
        </div>
      ),
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>House/Dorm</span>,
      selector: row => <span className='text-base text-gray-700'>{row.houseDorm}</span>,
      sortable: true,
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>Class</span>,
      selector: row => <span className='text-base text-gray-700'>{row.class}</span>,
      sortable: true,
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>Occupation</span>,
      selector: row => <span className='text-base text-gray-700'>{row.currentOccupation}</span>,
      sortable: true,
    },
    {
      name: <span className='text-base font-semibold text-slate-500'>Submitted</span>,
      selector: row => <span className='text-base text-gray-700 break-all'>{row.timestamp}</span>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => navigate(`/response/${row.id}`, { state: { response: row } })}
          className='text-green-800 font-medium text-sm'
        >
          View
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  if (!user) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }



// Fixed exportToExcel function
const exportToExcel = () => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  
  // Prepare data for export - only include needed fields
  const exportData = filteredData.map(item => ({
    'First Name': item.firstName || '',
    'Surname': item.surname || '',
    'Maiden Name': item.maidenName || '',
    'House/Dorm': item.houseDorm || '',
    'Class': item.class || '',
    'Occupation': item.currentOccupation || '',
    'Submitted': item.timestamp || ''
  }));
  
  // Create a worksheet
  const ws = utils.json_to_sheet(exportData);
  // Create a workbook
  const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  // Convert to array buffer
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
  // Create a Blob
  const data = new Blob([excelBuffer], { type: fileType });
  
  // Create link and download
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `form_responses${fileExtension}`;
  link.click();
};

// Fixed exportToPDF function

const exportToPDF = () => {
  // Create new jsPDF instance
  const doc = new jsPDF();
  
  // Make sure jspdf-autotable is properly imported and initialized
  // If you have 'import 'jspdf-autotable'' at the top of your file,
  // the autoTable method should be available on the jsPDF instance
  
  // Add title
  doc.text('Form Responses', 14, 15);
  
  // Manually create table without autotable plugin
  const tableData = [];
  
  // Add header row
  tableData.push([
    'First Name', 
    'Surname', 
    'Maiden Name', 
    'House/Dorm', 
    'Class', 
    'Occupation', 
    'Submitted'
  ]);
  
  // Add data rows
  filteredData.forEach(item => {
    tableData.push([
      item.firstName || '',
      item.surname || '',
      item.maidenName || '',
      item.houseDorm || '',
      item.class || '',
      item.currentOccupation || '',
      item.timestamp || ''
    ]);
  });
  
  // Check if autoTable is available
  if (typeof doc.autoTable === 'function') {
    // Use autoTable if available
    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [33, 150, 83] }
    });
  } else {
    // Fallback to basic table rendering without autoTable
    console.warn('autoTable not available, using basic table rendering');
    
    const startY = 25;
    const cellPadding = 10;
    const colWidth = 25;
    const rowHeight = 10;
    
    // Set small font for headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Draw headers
    tableData[0].forEach((header, i) => {
      doc.text(header, 10 + (i * colWidth), startY);
    });
    
    // Set normal font for data
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Draw data rows (limit to 30 records to avoid issues)
    const maxRows = Math.min(tableData.length - 1, 30);
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < tableData[0].length; col++) {
        doc.text(
          String(tableData[row + 1][col]).substring(0, 10), // Limit text length
          10 + (col * colWidth),
          startY + ((row + 1) * rowHeight)
        );
      }
    }
    
    if (tableData.length > 31) {
      doc.text('...and more records (limited display)', 10, startY + ((maxRows + 1) * rowHeight));
    }
  }
  
  // Save the PDF
  doc.save('form_responses.pdf');
};
  return (
    <div className="flex flex-col w-full">
      {/* Navbar */}
      <div className="flex gap-3 justify-between items-center mb-2 pb-3 mt-3 px-4 border-b relative">
        <Link  to='/admin-dashboard'  className="text-2xl max-sm:text-base max-xs:text-sm font-bold text-slate-800">Admin Dashboard</Link>
        
        {/* Hamburger Menu for Medium Screens and Below */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-slate-700 hover:text-green-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center items-center gap-4">
        {
          superAdmin?
                  
          <Link  to="/add-admin"  className='font-semibold text-base cursor-pointer text-slate-700 hover:text-green-700'>Add Admin</Link>


          :""

        }

        {
          superAdmin?
                  


          <Link to='/admin-users' className='font-semibold text-base  cursor-pointer hover:text-green-700 text-slate-700'>Admin list</Link>
          :""

        }

         
         <div>
                      <span className='text-sm '>Logged in as: {user.email}</span>

         </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        <div
          className={`md:hidden absolute top-full z-50 w-full  right-0 bg-white border border-slate-300 shadow-md transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-4">
            <span className="text-slate-600 mb-2">Logged in as: {user.email}</span>
            {
          superAdmin?
                  
          <Link  to="/add-admin"  className='font-semibold text-base cursor-pointer text-slate-700 hover:text-green-700'>Add Admin</Link>


          :""



        }

        {
          superAdmin?
                  


          <Link to='/admin-users' className='font-semibold text-base  cursor-pointer hover:text-green-700 text-slate-700'>Admin list</Link>
          :""

        }

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Rest of the Content */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

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


      <div className="bg-white border border-slate-300 shadow-md mt-4 mx-4 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-700">Form Responses</h2>
          <p className="text-sm text-slate-500 mt-1">Total: {filteredData.length}</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-slate-600">Loading form responses...</p>
          </div>
        ) : formResponses.length === 0 ? (
          <div className="text-center py-10 text-slate-600">
            No form responses found.
          </div>
        ) : (
          <div className='px-4'>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              responsive
              subHeader
              subHeaderComponent={
                <div className='w-full flex justify-between '>

<div className="flex gap-2 mt-2">
          <CSVLink 
            data={filteredData}
            filename="form_responses.csv"
            className="px-3 py-1  text-sm rounded-md  flex flex-row gap-2 justify-between border border-slate-300 hover:bg-gray-400 hover:text-gray-100   items-center "
          >
          
          <FaFileCsv/>
            Export CSV
          </CSVLink>
          <button 
            onClick={exportToExcel}
                        className="px-3 py-1  text-sm rounded-md  flex flex-row gap-2 justify-between border border-slate-300 hover:bg-gray-400 hover:text-gray-100   items-center "
          >
          <FaFileExcel/>
            Export Excel
          </button>
          <button 
            onClick={exportToPDF}
                        className="px-3 py-1  text-sm rounded-md  flex flex-row gap-2 justify-between border border-slate-300 hover:bg-gray-400 hover:text-gray-100   items-center "
          >
          <FaFilePdf/>
            Export PDF
          </button>
        </div>
      

                  <form className="w-80 my-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                      </div>
                      <input
                        type="search"
                        placeholder="Search by name, house, class, or occupation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-green-800 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </form>
                </div>
              }
              noHeader
              defaultSortFieldId={1}
              defaultSortAsc={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;