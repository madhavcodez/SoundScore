import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlbumSearch({ onResults }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchAlbums = async () => {
      if (!query.trim()) {
        onResults([]);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/albums/search`, {
          params: { q: query }
        });
        onResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const debounce = setTimeout(searchAlbums, 300);
    return () => clearTimeout(debounce);
  }, [query, onResults]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for albums..."
        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
      />
    </div>
  );
}

export default AlbumSearch; 