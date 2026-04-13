import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="py-16 text-center">
        <div className="relative inline-flex">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-[#D30013]"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-[#D30013] opacity-20"></div>
        </div>
        {/* <p className="mt-6 text-lg font-medium text-gray-700">Loading...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait</p> */}
      </div>
    </div>
  );
};

export default Loading;
