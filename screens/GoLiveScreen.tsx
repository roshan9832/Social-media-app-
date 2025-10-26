
import React, { useState, useEffect, useRef } from 'react';
import { BackIcon } from '../components/Icons';

interface GoLiveScreenProps {
  onBack: () => void;
  onGoLive: (caption: string) => void;
}

const GoLiveScreen: React.FC<GoLiveScreenProps> = ({ onBack, onGoLive }) => {
  const [caption, setCaption] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt to get user media
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Handle error - maybe show a message to the user
      }
    };

    getCamera();

    return () => {
      // Cleanup: stop media tracks when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="text-dumm-text-light flex flex-col h-screen bg-black">
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onBack} className="bg-black/30 p-2 rounded-full">
          <BackIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="flex-1 relative">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
        <div className="absolute inset-0 bg-black/20"></div>
      </main>

      <footer className="p-4 bg-black/50 backdrop-blur-sm z-10">
        <p className="font-bold text-lg">Ready to go live?</p>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption for your stream..."
          className="w-full bg-transparent border-b border-dumm-gray-300 py-2 my-4 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
        />
        <button
          onClick={() => onGoLive(caption)}
          className="w-full bg-dumm-pink text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Go Live
        </button>
      </footer>
    </div>
  );
};

export default GoLiveScreen;
