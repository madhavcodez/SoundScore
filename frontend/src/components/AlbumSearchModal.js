import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AlbumSearchModal({ onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchAlbums = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const token = new URLSearchParams(window.location.search).get('access_token');
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            q: searchQuery,
            type: 'album',
            limit: 10
          }
        });

        setSearchResults(response.data.albums.items);
      } catch (error) {
        console.error('Error searching albums:', error);
        toast.error('Failed to search albums');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAlbums, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1C2820] rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Search Albums</h2>
          <button
            onClick={onClose}
            className="text-[#8BA888] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an album..."
            className="w-full bg-[#2C382E] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
          />
          {isLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8BA888]"></div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {searchResults.map((album) => (
            <button
              key={album.id}
              onClick={() => onSelect(album)}
              className="w-full flex items-center space-x-4 p-3 hover:bg-[#2C382E] rounded-lg transition-colors"
            >
              <img
                src={album.images[0]?.url}
                alt={album.name}
                className="w-16 h-16 rounded-lg"
              />
              <div className="text-left">
                <div className="text-white font-medium">{album.name}</div>
                <div className="text-[#8BA888] text-sm">{album.artists[0].name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlbumSearchModal; 