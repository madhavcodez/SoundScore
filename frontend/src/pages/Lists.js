import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-feather';
import axios from 'axios';
import Navbar from '../components/Navbar';
import List from '../components/List';
import { toast } from 'react-hot-toast';

const Lists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, my, liked

  useEffect(() => {
    const fetchLists = async () => {
      try {
        let response;
        switch (filter) {
          case 'my':
            response = await axios.get('/api/lists/my');
            break;
          case 'liked':
            response = await axios.get('/api/lists/liked');
            break;
          default:
            response = await axios.get('/api/lists');
        }
        setLists(response.data);
      } catch (error) {
        console.error('Error fetching lists:', error);
        toast.error('Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [filter]);

  const handleUpdate = (updatedList) => {
    setLists(lists.map(list =>
      list._id === updatedList._id ? updatedList : list
    ));
  };

  const handleDelete = (listId) => {
    setLists(lists.filter(list => list._id !== listId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      {/* Global Ambient Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-white">Lists</h1>
            <button
              onClick={() => navigate('/lists/new')}
              className="flex items-center space-x-2 bg-[#8BA888] text-white px-4 py-2 rounded-lg hover:bg-[#8BA888]/90 transition-colors"
            >
              <Plus size={20} />
              <span>Create List</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-[#8BA888] text-white'
                  : 'bg-[#2C382E]/30 text-[#8BA888] hover:bg-[#2C382E]/50'
              }`}
            >
              All Lists
            </button>
            <button
              onClick={() => setFilter('my')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'my'
                  ? 'bg-[#8BA888] text-white'
                  : 'bg-[#2C382E]/30 text-[#8BA888] hover:bg-[#2C382E]/50'
              }`}
            >
              My Lists
            </button>
            <button
              onClick={() => setFilter('liked')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'liked'
                  ? 'bg-[#8BA888] text-white'
                  : 'bg-[#2C382E]/30 text-[#8BA888] hover:bg-[#2C382E]/50'
              }`}
            >
              Liked Lists
            </button>
          </div>

          {/* Lists */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA888]"></div>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center text-[#8BA888] py-8">
              No lists found
            </div>
          ) : (
            <div className="space-y-6">
              {lists.map(list => (
                <List
                  key={list._id}
                  list={list}
                  isOwner={list.creator._id === localStorage.getItem('userId')}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lists; 