import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AlbumSearch({ onSelectAlbum }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from Spotify
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = new URLSearchParams(window.location.search).get('access_token');
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: searchQuery,
          type: 'album',
          limit: 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Format the suggestions
      const formattedSuggestions = response.data.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artist: album.artists[0].name,
        imageUrl: album.images[0]?.url,
        releaseDate: album.release_date
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to fetch album suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (album) => {
    setQuery(`${album.name} - ${album.artist}`);
    setShowSuggestions(false);
    onSelectAlbum(album);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-16" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for albums..."
          className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8BA888]"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-black/90 backdrop-blur-md rounded-xl border border-gray-800 
                      shadow-xl max-h-96 overflow-y-auto custom-scrollbar z-50">
          {suggestions.map((album) => (
            <button
              key={album.id}
              onClick={() => handleSelect(album)}
              className="w-full px-4 py-3 flex items-center space-x-4 hover:bg-white/5 
                       transition-colors duration-200"
            >
              <img
                src={album.imageUrl}
                alt={album.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="text-left">
                <div className="text-white font-medium truncate">{album.name}</div>
                <div className="text-gray-400 text-sm truncate">{album.artist}</div>
                <div className="text-gray-500 text-xs">{album.releaseDate}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlbumSearch; 