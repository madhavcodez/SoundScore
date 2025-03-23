import React, { useState, useRef } from 'react';

function PreviewPlayer({ previewUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {previewUrl && (
        <div className="absolute bottom-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-8 h-8 bg-[#8BA888] rounded-full flex items-center justify-center
                       hover:bg-[#7A9877] transition-colors duration-300"
          >
            {isPlaying ? (
              <span className="text-white text-xl">⏸</span>
            ) : (
              <span className="text-white text-xl">▶</span>
            )}
          </button>
          <audio
            ref={audioRef}
            src={previewUrl}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}
    </>
  );
}

export default PreviewPlayer; 