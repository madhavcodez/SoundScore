import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AlbumDetailsModal from './AlbumDetailsModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Section({ title, albums, showAddButton }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleRatingSubmit = async (albumId, rating, review) => {
    try {
      const userId = new URLSearchParams(window.location.search).get('userId');
      const token = new URLSearchParams(window.location.search).get('access_token');
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId,
        rating,
        review,
        userId,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Rating submitted successfully!');
      setSelectedAlbum(null);
      
      // Refresh the data
      if (typeof window.fetchData === 'function') {
        window.fetchData();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const handleAlbumClick = (album) => {
    console.log('Album being clicked:', album);
    setSelectedAlbum(album);
  };

  if (!albums || albums.length === 0) {
    return null; // Don't render the section if there are no albums
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="group relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full 
                   text-[#A4C3A2] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   hover:bg-black/70 -translate-x-1/2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {albums.map((album) => (
            <div 
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className="flex-none w-48 transform transition-transform duration-300 
                       hover:scale-105 cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-[#2C382E]/30">
                <img 
                  src={album.imageUrl}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium truncate text-white">{album.name}</h3>
              <p className="text-sm text-[#8BA888] truncate">{album.artist}</p>
              {album.review && (
                <div className="mt-2 text-sm text-[#8BA888]">
                  <Link 
                    to={`/profile/${album.userId}`}
                    className="font-medium text-[#A4C3A2] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {album.username}
                  </Link>
                  <p className="mt-1">{album.review}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full 
                   text-[#A4C3A2] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   hover:bg-black/70 translate-x-1/2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {selectedAlbum && (
        <AlbumDetailsModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onRate={handleRatingSubmit}
        />
      )}
    </div>
  );
}

export default Section; 