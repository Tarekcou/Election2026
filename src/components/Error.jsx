// import React from 'react';

const Error = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <div className="text-xl text-red-600">ত্রুটি: {message}</div>
        <p className="text-gray-600 mt-2">দয় করে পেজ রিফ্রেশ করুন</p>
      </div>
    </div>
  );
};

export default Error;
