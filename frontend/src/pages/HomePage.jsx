import React from 'react';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <img className="max-w-xs" src="/images/life-matters-logo-t-nnm.png" alt="Logo" />
      </div>
      <div className="flex flex-col items-center gap-4 mt-4">
        <button className="bg-[#7326F1] text-white font-bold py-2 px-7 rounded-full">Ambulance</button>
        <button className="bg-[#7326F1] text-white font-bold py-2 px-6 rounded-full">Traffic Police</button>
      </div>
    </div>
  );
}

export default HomePage;
