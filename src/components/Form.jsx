import React, { useEffect, useState } from 'react';
import logo from "../assets/Done.svg";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function Form() {
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    maidenName: '',
    houseDorm: '',
    program: '',
    class: '',
    currentOccupation: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);

  const dorms = ['Fatima', 'St. Josephs', 'St. Luanga', 'St. Martins', 'Mary Joannes'];
  const programs = ['Science', 'General Arts', 'Visual Arts', 'Home Economics'];
  const programClasses = {
    'Science': ['Science A', 'Science B', 'Science C'],
    'General Arts': ['AG', 'AS', 'AL', 'AM', 'AF'],
    'Visual Arts': ['AV'],
    'Home Economics': ['BV']
  };

  useEffect(() => {
    if (formData.program) {
      setClasses(programClasses[formData.program]);
    } else {
      setClasses([]);
    }
  }, [formData.program]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.houseDorm.trim()) newErrors.houseDorm = "House/Dorm is required";
    if (!formData.program.trim()) newErrors.program = "Program is required";
    if (!formData.class.trim()) newErrors.class = "Class is required";
    if (!formData.currentOccupation.trim()) newErrors.currentOccupation = "Current Occupation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const docRef = await addDoc(collection(db, "formResponses"), {
          ...formData,
          timestamp: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        setFormData({
          firstName: '',
          surname: '',
          maidenName: '',
          houseDorm: '',
          program: '',
          class: '',
          currentOccupation: ''
        });
        setDone(true);
      } catch (error) {
        console.error("Error adding document: ", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className='flex max-sm:mt-72 max-md:mt-64 mt-64 max-xs:mt-[500px] justify-center flex-col w-full items-center'>
      {done ? (
        <div className='g:w-[50%] md:w-[60%] sm:w-[75%] w-[90%] bg-white rounded-md border  py-10 bg-opacity-80  '>
          <div className='flex justify-center items-center flex-col'>
            <img className='h-72' src={logo} alt="Success" />
            <p className='text-xl font-semibold text-slate-700 mt-5'>Thank you for your response</p>
            <button onClick={() => setDone(false)} className='bg-green-700 px-5 py-3 flex flex-row gap-2 text-white rounded-md mt-5'>
              <svg className='h-7' viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                <path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
              </svg>
              Back to form
            </button>
          </div>
        </div>
      ) : (
        <div className='text-slate-800 flex bg-white bg-opacity-70 flex-col border-slate-200 shadow rounded-md border py-4 lg:w-[50%] md:w-[60%] sm:w-[75%] w-[90%]'>
          <div className='text-slate-600 text-xl font-semibold py-2 border-b border-slate-200 px-4'>
            Personal Information
          </div>

          <div className='w-full py-5 px-4'>
            {/* First Name */}
            <div className='mb-5'>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  className={`block rounded-t-lg px-2.5  pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  placeholder=" "
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <label htmlFor="firstName" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  First name <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Surname */}
            <div className='mb-5'>
              <div className="relative">
                <input
                  type="text"
                  id="surname"
                  className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.surname ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  placeholder=" "
                  value={formData.surname}
                  onChange={handleChange}
                />
                <label htmlFor="surname" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  Surname <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
            </div>

            {/* Maiden Name */}
            <div className='mb-5'>
              <div className="relative">
                <input
                  type="text"
                  id="maidenName"
                  className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer"
                  placeholder=" "
                  value={formData.maidenName}
                  onChange={handleChange}
                />
                <label htmlFor="maidenName" className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  Maiden name
                </label>
              </div>
              <p id="helper-text-explanation" className="mt-1 text-sm text-gray-700">Full name before marriage if applicable</p>
            </div>

            {/* House/Dorm */}
            <div className='mb-5'>
              <div className="relative">
                <select
                  id="houseDorm"
                  className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.houseDorm ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  value={formData.houseDorm}
                  onChange={handleChange}
                >
                  <option value="">Select Dorm</option>
                  {dorms.map((dorm, index) => (
                    <option key={index} value={dorm}>{dorm}</option>
                  ))}
                </select>
                <label htmlFor="houseDorm" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  House/Dorm <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.houseDorm && <p className="text-red-500 text-xs mt-1">{errors.houseDorm}</p>}
            </div>

            {/* Program */}
            <div className='mb-5'>
              <div className="relative">
                <select
                  id="program"
                  className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.program ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  value={formData.program}
                  onChange={handleChange}
                >
                  <option value="">Select Program</option>
                  {programs.map((program, index) => (
                    <option key={index} value={program}>{program}</option>
                  ))}
                </select>
                <label htmlFor="program" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  Program <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
            </div>

            {/* Class */}
            <div className='mb-5'>
              <div className="relative">
                <select
                  id="class"
                  className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.class ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  value={formData.class}
                  onChange={handleChange}
                  disabled={!formData.program}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls, index) => (
                    <option key={index} value={cls}>{cls}</option>
                  ))}
                </select>
                <label htmlFor="class" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  Class <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
            </div>

            {/* Current Occupation */}
            <div className='mb-10'>
              <div className="relative">
                <input
                  type="text"
                  id="currentOccupation"
                  className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 ${errors.currentOccupation ? 'border-red-500' : 'border-gray-300'} appearance-none dark:focus:border-green-700 focus:outline-none focus:ring-0 focus:border-green-800 peer`}
                  placeholder=" "
                  value={formData.currentOccupation}
                  onChange={handleChange}
                />
                <label htmlFor="currentOccupation" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-110 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                  Current Occupation <span className="text-red-600">*</span>
                </label>
              </div>
              {errors.currentOccupation && <p className="text-red-500 text-xs mt-1">{errors.currentOccupation}</p>}
            </div>

            <div className='w-full'>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='w-full flex flex-row gap-4 justify-center rounded-md text-white transition duration-300 hover:bg-green-800 bg-green-700 text-center font-semibold text-base py-3 disabled:bg-green-400'
              >
                {isSubmitting ? <div className='flex flex-row gap-4 justify-center items-center'> <div className="spinner mx-3"></div> <span>Submitting...</span></div> : "Submit Response"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='my-10 text-transparent'>dsfdfdf</div>
    </div>
  );
}

export default Form;