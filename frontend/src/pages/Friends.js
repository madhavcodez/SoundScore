import React from 'react';
import Navbar from '../components/Navbar';

function Friends({ userProfile }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      {/* Global Ambient Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      <Navbar userProfile={userProfile} />

      {/* Friends Section */}
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Friends</h1>
          <div className="bg-[#2C382E]/30 rounded-lg p-6">
            <p className="text-[#8BA888] text-center">Friends feature coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends; 