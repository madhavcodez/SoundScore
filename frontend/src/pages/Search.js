import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'react-feather';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('albums');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'albums', label: 'Albums' },
    { id: 'friends', label: 'Friends' },
    { id: 'lists', label: 'Lists' },
    { id: 'artists', label: 'Artists' }
  ];

  const searchAlbums = async (searchQuery) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: searchQuery,
          type: 'album',
          limit: 20
        }
      });
      return response.data.albums.items;
    } catch (error) {
      console.error('Error searching albums:', error);
      throw error;
    }
  };

  const searchFriends = async (searchQuery) => {
    try {
      const response = await axios.get(`/api/friends/search?username=${searchQuery}`);
      return response.data;
    } catch (error) {
      console.error('Error searching friends:', error);
      throw error;
    }
  };

  const searchArtists = async (searchQuery) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: searchQuery,
          type: 'artist',
          limit: 20
        }
      });
      return response.data.artists.items;
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  };

  const performSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResults = [];
        switch (category) {
          case 'albums':
            searchResults = await searchAlbums(searchQuery);
            break;
          case 'friends':
            searchResults = await searchFriends(searchQuery);
            break;
          case 'artists':
            searchResults = await searchArtists(searchQuery);
            break;
          case 'lists':
            // TODO: Implement lists search
            searchResults = [];
            break;
          default:
            searchResults = [];
        }
        setResults(searchResults);
      } catch (error) {
        setError('Failed to fetch search results');
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [category]
  );

  useEffect(() => {
    performSearch(query);
  }, [query, category, performSearch]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setResults([]);
  };

  const handleFriendRequest = async (userId) => {
    try {
      await axios.post('/api/friends/requests', { recipientId: userId });
      // Update the results to reflect the new request status
      setResults(prevResults =>
        prevResults.map(user =>
          user._id === userId
            ? { ...user, hasOutgoingRequest: true }
            : user
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      );
    }

    if (results.length === 0 && query.trim()) {
      return (
        <div className="text-center text-gray-500 py-8">
          No results found
        </div>
      );
    }

    switch (category) {
      case 'albums':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(album => (
              <div
                key={album.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/album/${album.id}`)}
              >
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="w-full aspect-square object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-white truncate">{album.name}</h3>
                <p className="text-gray-400 text-sm truncate">{album.artists[0].name}</p>
              </div>
            ))}
          </div>
        );

      case 'friends':
        return (
          <div className="space-y-4">
            {results.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profileImage || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{user.username}</h3>
                    <p className="text-gray-400 text-sm">{user.displayName}</p>
                  </div>
                </div>
                {!user.isFriend && !user.hasOutgoingRequest && (
                  <button
                    onClick={() => handleFriendRequest(user._id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Friend
                  </button>
                )}
                {user.hasOutgoingRequest && (
                  <span className="text-gray-400">Request Sent</span>
                )}
              </div>
            ))}
          </div>
        );

      case 'artists':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(artist => (
              <div
                key={artist.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-white truncate">{artist.name}</h3>
              </div>
            ))}
          </div>
        );

      case 'lists':
        return (
          <div className="text-center text-gray-500 py-8">
            Lists feature coming soon!
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      {/* Global Ambient Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      {/* Search Section */}
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search Bar */}
          <div className="relative mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#2C382E]/30 text-white rounded-lg pl-12 pr-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#8BA888] placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Toggle */}
          <div className="relative mb-8">
            <div className="flex relative bg-[#2C382E]/30 rounded-lg p-1">
              {/* Sliding Background */}
              <div
                className="absolute bg-[#8BA888]/20 rounded-md transition-all duration-300 ease-in-out"
                style={{
                  width: `${100 / categories.length}%`,
                  height: 'calc(100% - 8px)',
                  top: '4px',
                  left: `${(categories.findIndex(c => c.id === category) * 100) / categories.length}%`
                }}
              />
              
              {/* Category Buttons */}
              {categories.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                    category === id
                      ? 'text-[#8BA888]'
                      : 'text-[#8BA888]/50 hover:text-[#8BA888]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="transition-opacity duration-300">
            {renderResults()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search; 