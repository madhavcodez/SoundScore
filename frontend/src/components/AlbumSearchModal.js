import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search } from 'react-feather';

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
        const token = localStorage.getItem('spotify_token');
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
      <div className="bg-gradient-to-br from-[#1C2820] to-[#141414] rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-[#8BA888]/20">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute w-96 h-96 bg-[#8BA888]/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#8BA888]/5 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Search Albums</h2>
            <button
              onClick={onClose}
              className="text-[#8BA888] hover:text-white transition-colors p-2 hover:bg-[#2C382E] rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8BA888]">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an album..."
              className="w-full bg-[#2C382E]/50 text-white rounded-full pl-12 pr-4 py-3 
                       focus:outline-none focus:ring-2 focus:ring-[#8BA888] focus:bg-[#2C382E]
                       placeholder-[#8BA888]/50 transition-all duration-200"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8BA888]"></div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {searchResults.map((album) => (
              <button
                key={album.id}
                onClick={() => onSelect(album)}
                className="w-full flex items-center space-x-4 p-4 hover:bg-[#2C382E]/50 
                         rounded-xl transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-16 h-16 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-[#8BA888]/0 group-hover:bg-[#8BA888]/10 
                                rounded-lg transition-colors duration-200"></div>
                </div>
                <div className="text-left flex-1">
                  <div className="text-white font-medium group-hover:text-[#8BA888] transition-colors duration-200">
                    {album.name}
                  </div>
                  <div className="text-[#8BA888] text-sm">{album.artists[0].name}</div>
                  <div className="text-[#8BA888]/50 text-xs mt-1">
                    {new Date(album.release_date).getFullYear()}
                  </div>
                </div>
                <div className="text-[#8BA888] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
            ))}
            {searchQuery && !isLoading && searchResults.length === 0 && (
              <div className="text-center py-8 text-[#8BA888]">
                No albums found. Try a different search term.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumSearchModal; 