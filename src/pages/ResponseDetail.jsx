import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResponseDetail() {
  const location = useLocation();
  const response = location.state?.response; // Get the response data passed via navigation
  const navigate = useNavigate();

  if (!response) {
    return <div className="text-center py-10">No response data found.</div>;
  }

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl max-sm:text-base font-bold text-slate-700">Response Details</h1>
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="bg-green-700 flex flex-row gap-2 items-center  transition text-white font-bold py-2 px-4 rounded"
        >
                  <svg className='h-7' viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#ffffff" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>

          Back
        </button>
      </div>

      <div className="bg-white border border-slate-300 shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b  pb-4 ">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">First Name</p>
            <p className="text-base font-medium text-gray-700">{response.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Surname</p>
            <p className="text-base font-medium text-gray-700">{response.surname}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Maiden Name</p>
            <p className="text-base font-medium text-gray-700">{response.maidenName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">House/Dorm</p>
            <p className="text-base font-medium text-gray-700">{response.houseDorm}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Class</p>
            <p className="text-base font-medium text-gray-700">{response.class}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Occupation</p>
            <p className="text-base font-medium text-gray-700">{response.currentOccupation}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Submitted</p>
            <p className="text-base font-medium text-gray-700">{response.timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponseDetail;