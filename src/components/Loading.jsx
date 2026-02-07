// import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <div className="text-xl">নির্বাচনী ফলাফল লোড হচ্ছে...</div>
      </div>
    </div>
  );
};

export default Loading;
