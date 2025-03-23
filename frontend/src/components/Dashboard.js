import React from 'react';
import RatingForm from './RatingForm';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Album Ratings</h1>
      <RatingForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold">Album Title</h2>
          <p>Rating: 4/5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 