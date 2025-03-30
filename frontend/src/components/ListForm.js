import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search as SearchIcon, Plus, X } from 'react-feather';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';

const ListForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [visibility, setVisibility] = useState(initialData?.visibility || 'public');
  const [items, setItems] = useState(initialData?.items || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAlbums = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: 'album',
          limit: 10
        }
      });
      setSearchResults(response.data.albums.items);
    } catch (error) {
      console.error('Error searching albums:', error);
      toast.error('Failed to search albums');
    }
  };

  const debouncedSearch = debounce(searchAlbums, 500);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleAddAlbum = (album) => {
    if (!items.some(item => item.albumId === album.id)) {
      setItems([...items, { albumId: album.id, notes: '' }]);
      setSearchQuery('');
      setSearchResults([]);
    } else {
      toast.error('This album is already in the list');
    }
  };

  const handleRemoveAlbum = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateNotes = (index, notes) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], notes };
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (id) {
        await axios.put(`/api/lists/${id}`, {
          title,
          description,
          visibility,
          items
        });
        toast.success('List updated successfully');
      } else {
        await axios.post('/api/lists', {
          title,
          description,
          visibility,
          items
        });
        toast.success('List created successfully');
      }
      navigate('/lists');
    } catch (error) {
      console.error('Error saving list:', error);
      toast.error('Failed to save list');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-[#8BA888] mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#2C382E]/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
            placeholder="Enter list title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#8BA888] mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#2C382E]/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888] h-32"
            placeholder="Describe your list..."
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-[#8BA888] mb-2">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full bg-[#2C382E]/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        {/* Album Search */}
        <div>
          <label className="block text-[#8BA888] mb-2">Add Albums</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2C382E]/30 text-white rounded-lg pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
              placeholder="Search for albums..."
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8BA888]" />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-[#2C382E]/30 rounded-lg overflow-hidden">
              {searchResults.map(album => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => handleAddAlbum(album)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-[#2C382E]/50 transition-colors"
                >
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="text-left">
                    <div className="text-white">{album.name}</div>
                    <div className="text-[#8BA888] text-sm">{album.artists[0].name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Albums */}
        <div>
          <label className="block text-[#8BA888] mb-2">Selected Albums</label>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-[#2C382E]/30 rounded-lg p-4"
              >
                <img
                  src={item.album?.images[0]?.url}
                  alt={item.album?.name}
                  className="w-16 h-16 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white">{item.album?.name}</h3>
                      <p className="text-[#8BA888] text-sm">{item.album?.artists[0]?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlbum(index)}
                      className="text-[#8BA888] hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleUpdateNotes(index, e.target.value)}
                    className="mt-2 w-full bg-[#2C382E]/50 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
                    placeholder="Add notes about this album..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#8BA888] text-white rounded-lg px-6 py-3 hover:bg-[#8BA888]/90 transition-colors"
        >
          {id ? 'Update List' : 'Create List'}
        </button>
      </form>
    </div>
  );
};

export default ListForm; 