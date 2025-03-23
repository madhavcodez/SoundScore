import React, { useState, useRef } from 'react';
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
    const formattedAlbum = {
      id: album.id,
      name: album.name,
      artist: album.artist || album.artists?.[0]?.name,
      imageUrl: album.imageUrl || album.images?.[0]?.url,
      artists: album.artists || [{ name: album.artist }]
    };
    console.log('Album being clicked:', album);
    setSelectedAlbum(formattedAlbum);
  };

  return (
    <div className="relative group">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {/* Scroll Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full 
                  text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  hover:bg-black/70 -translate-x-1/2 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide scroll-smooth"
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex-none w-48 cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => handleAlbumClick(album)}
          >
            <div className="relative aspect-square">
              <img
                src={album.imageUrl || album.images?.[0]?.url}
                alt={album.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-60 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button className="text-white bg-[#8BA888] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
            <h3 className="mt-2 text-white font-semibold truncate">{album.name}</h3>
            <p className="text-gray-400 text-sm truncate">
              {album.artist || album.artists?.[0]?.name}
            </p>
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full 
                  text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  hover:bg-black/70 translate-x-1/2 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

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