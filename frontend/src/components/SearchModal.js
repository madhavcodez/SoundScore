import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchModal({ onClose, onAlbumSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchAlbums = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/albums/search`, {
          params: { q: query }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchAlbums, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for albums..."
            className="w-full px-4 py-2 bg-[#1a1a1a] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
          />
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((album) => (
                <div
                  key={album.id}
                  onClick={() => onAlbumSelect(album)}
                  className="cursor-pointer hover:bg-[#3a3a3a] p-2 rounded-lg transition-colors"
                >
                  <img
                    src={album.imageUrl}
                    alt={album.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="mt-2">
                    <div className="text-white font-semibold truncate">{album.name}</div>
                    <div className="text-gray-400 text-sm truncate">{album.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal; 