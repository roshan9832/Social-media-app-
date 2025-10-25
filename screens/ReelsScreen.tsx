
import React, { useState, useRef, useEffect } from 'react';
import { Reel } from '../types';
import { USERS, REELS } from '../constants';
import { LikeIcon, CommentIcon, ShareIcon, MoreIcon, MusicNoteIcon, BackIcon } from '../components/Icons';

interface ReelItemProps {
  reel: Reel;
  onProfileClick: (userId: string) => void;
  isVisible: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ reel, onProfileClick, isVisible }) => {
    const user = USERS.find(u => u.id === reel.userId);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.play().catch(error => console.error("Video play failed:", error));
            setIsPlaying(true);
        } else {
            videoRef.current?.pause();
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }
            setIsPlaying(false);
        }
    }, [isVisible]);
    
    const handleVideoPress = () => {
        if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current?.play().catch(error => console.error("Video play failed:", error));
            setIsPlaying(true);
        }
    };

    if (!user) return null;

    return (
        <div className="relative h-screen w-full snap-start flex-shrink-0">
            <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                playsInline
                className="w-full h-full object-cover"
                onClick={handleVideoPress}
            ></video>
            
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center" onClick={handleVideoPress}>
                    <svg className="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center cursor-pointer" onClick={() => onProfileClick(user.id)}>
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <p className="font-bold ml-3">{user.username}</p>
                    <button className="ml-3 px-3 py-1 border border-white rounded-md text-sm font-semibold">Follow</button>
                </div>
                <p className="mt-2 text-sm">{reel.caption}</p>
                <div className="flex items-center mt-2">
                    <MusicNoteIcon className="w-5 h-5" />
                    <p className="text-sm ml-2">{reel.audioTitle}</p>
                </div>
            </div>

            <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-4 text-white">
                <div className="flex flex-col items-center">
                    <button onClick={() => setIsLiked(!isLiked)} className="bg-black/30 p-3 rounded-full">
                        <LikeIcon className={`w-8 h-8 ${isLiked ? 'text-dumm-pink fill-current' : ''}`} />
                    </button>
                    <span className="text-sm font-semibold">{reel.likes + (isLiked ? 1 : 0)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <button className="bg-black/30 p-3 rounded-full">
                        <CommentIcon className="w-8 h-8" />
                    </button>
                    <span className="text-sm font-semibold">{reel.comments}</span>
                </div>
                <div className="flex flex-col items-center">
                     <button className="bg-black/30 p-3 rounded-full">
                        <ShareIcon className="w-8 h-8" />
                    </button>
                    <span className="text-sm font-semibold">{reel.shares}</span>
                </div>
                 <div className="flex flex-col items-center">
                    <button className="bg-black/30 p-3 rounded-full">
                        <MoreIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="mt-2">
                    <img src={user.avatarUrl} alt="audio" className="w-10 h-10 rounded-full object-cover border-2 border-gray-600 animate-spin-slow" />
                </div>
            </div>
        </div>
    );
}

interface ReelsScreenProps {
  onProfileClick: (userId: string) => void;
  onBack: () => void;
}

const ReelsScreen: React.FC<ReelsScreenProps> = ({ onProfileClick, onBack }) => {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(container.children).indexOf(entry.target);
                        if (index > 0) { // first child is header
                             setCurrentReelIndex(index-1);
                        }
                    }
                });
            },
            { threshold: 0.5 } 
        );

        // We observe the ReelItem divs, which are children of the container
        const items = container.querySelectorAll('.snap-start');
        items.forEach(item => observer.observe(item));

        return () => {
            items.forEach(item => observer.unobserve(item));
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full overflow-y-auto snap-y snap-mandatory relative bg-dumm-dark">
             <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={onBack}>
                    <BackIcon className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-xl font-bold text-white">Reels</h1>
                <div className="w-6 h-6"></div> 
             </header>
            {REELS.map((reel, index) => (
                <ReelItem 
                    key={reel.id} 
                    reel={reel} 
                    onProfileClick={onProfileClick} 
                    isVisible={index === currentReelIndex}
                />
            ))}
        </div>
    );
};

export default ReelsScreen;
