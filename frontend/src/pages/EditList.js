import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ListForm from '../components/ListForm';
import { toast } from 'react-hot-toast';

const EditList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`/api/lists/${id}`);
        setList(response.data);
      } catch (error) {
        console.error('Error fetching list:', error);
        toast.error('Failed to fetch list');
        navigate('/lists');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA888]"></div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold text-white mb-8">Edit List</h1>
          <ListForm initialData={list} />
        </div>
      </div>
    </div>
  );
};

export default EditList; 