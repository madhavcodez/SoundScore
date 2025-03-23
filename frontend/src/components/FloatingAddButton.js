import React from 'react';

function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 rounded-full shadow-lg 
                 flex items-center justify-center text-white text-2xl 
                 hover:bg-green-600 transition-colors duration-300 z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

export default FloatingAddButton; 