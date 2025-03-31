import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const RatingVisualizations = ({ ratings }) => {
  // Calculate rating distribution with half-star intervals
  const ratingDistribution = ratings.reduce((acc, rating) => {
    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for the chart with half-star intervals
  const distributionData = Array.from({ length: 9 }, (_, i) => {
    const rating = (i + 2) / 2; // Creates [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    return {
      rating,
      count: ratingDistribution[rating] || 0
    };
  });

  // Prepare data for the recent ratings chart
  const recentRatingsData = ratings
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(rating => ({
      date: new Date(rating.timestamp).toLocaleDateString(),
      rating: rating.rating,
      albumName: rating.albumName
    }));

  // Calculate statistics
  const totalRatings = ratings.length;
  const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings;

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <div className="bg-[#2C382E]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#8BA888]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Rating Statistics</h3>
          <div className="text-[#8BA888] text-sm">Last 30 days</div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="text-[#8BA888] text-sm font-medium">Total Ratings</div>
            <div className="text-3xl font-bold text-white">{totalRatings}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[#8BA888] text-sm font-medium">Average Rating</div>
            <div className="text-3xl font-bold text-white">{averageRating.toFixed(1)} <span className="text-yellow-400">★</span></div>
          </div>
        </div>
      </div>

      {/* Rating Distribution Chart */}
      <div className="bg-[#2C382E]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#8BA888]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Rating Distribution</h3>
          <div className="text-[#8BA888] text-sm">All time</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8BA888" opacity={0.1} />
              <XAxis 
                dataKey="rating" 
                stroke="#8BA888"
                tickFormatter={(value) => `${value}★`}
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2C382E', 
                  border: 'none',
                  borderRadius: '12px',
                  color: '#8BA888',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  opacity: 0.9
                }}
                formatter={(value, name, props) => {
                  if (props.payload.count === 0) return [null, null];
                  return [`${value} ratings`, 'Count'];
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar 
                dataKey="count" 
                fill="#8BA888" 
                radius={[6, 6, 0, 0]}
                opacity={0.8}
                onMouseEnter={(data) => {
                  if (data && data.count > 0) {
                    const bar = document.querySelector(`[data-rating="${data.rating}"]`);
                    if (bar) {
                      bar.style.opacity = '1';
                    }
                  }
                }}
                onMouseLeave={(data) => {
                  if (data) {
                    const bar = document.querySelector(`[data-rating="${data.rating}"]`);
                    if (bar) {
                      bar.style.opacity = '0.8';
                    }
                  }
                }}
                data={distributionData.map(item => ({
                  ...item,
                  fill: item.count > 0 ? '#8BA888' : '#8BA888',
                  opacity: item.count > 0 ? 0.8 : 0.3
                }))}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Ratings Chart */}
      <div className="bg-[#2C382E]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#8BA888]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Rating History</h3>
          <div className="text-[#8BA888] text-sm">Last 30 days</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentRatingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8BA888" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="#8BA888"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2C382E', 
                  border: 'none',
                  borderRadius: '12px',
                  color: '#8BA888',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                formatter={(value, name) => [`${value}★`, 'Rating']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#8BA888" 
                strokeWidth={2}
                dot={{ fill: '#8BA888', r: 4, strokeWidth: 2, stroke: '#2C382E' }}
                domain={[1, 5]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RatingVisualizations; 