import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ReviewModal({ review, onClose }) {
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${review.userId}`);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`text-3xl ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-[#1a1a1a] to-[#2C382E] rounded-2xl w-full max-w-4xl mx-4 overflow-hidden shadow-2xl border border-[#8BA888]/10 animate-modalEntry"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header with Album Info */}
        <div className="relative">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#8BA888]/10 via-[#8BA888]/5 to-transparent"></div>
          
          {/* Content */}
          <div className="relative p-8 flex items-start space-x-8">
            {/* Album Image with Hover Effect */}
            <div className="relative group">
              <img 
                src={review.albumImageUrl} 
                alt={review.albumName} 
                className="w-52 h-52 rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Album Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-4xl font-bold text-white mb-3 leading-tight">{review.albumName}</h2>
                  <p className="text-[#8BA888] text-xl">{review.artistName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleProfileClick}
                    className="flex items-center space-x-3 bg-[#8BA888]/10 px-4 py-2 rounded-full hover:bg-[#8BA888]/20 transition-colors group"
                  >
                    <span className="font-bold text-white group-hover:text-[#8BA888] transition-colors">{review.username}</span>
                    <svg className="w-4 h-4 text-[#8BA888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Rating and Date */}
              <div className="space-y-3">
                <div className="inline-flex items-center bg-[#8BA888]/10 px-5 py-3 rounded-xl">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-white text-2xl font-bold ml-4 mr-1">{review.rating}.0</div>
                </div>
                <div className="text-[#8BA888] text-sm pl-2">
                  {new Date(review.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="p-8 pt-4">
          <div className="bg-[#2C382E]/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-[#8BA888] text-sm uppercase tracking-wider font-medium mb-6">Review</h3>
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{review.review}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes modalEntry {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-modalEntry {
    animation: modalEntry 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ReviewModal; 