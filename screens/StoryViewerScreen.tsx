
import React, { useState, useEffect, useRef } from 'react';
import { User, UserStories } from '../types';
import { USERS } from '../constants';
import { VolumeOffIcon, VolumeUpIcon, FastForwardIcon } from '../components/Icons';

interface StoryViewerScreenProps {
  initialUserId: string;
  onClose: () => void;
  userStories: UserStories[];
  onComment: (userId: string, storyId: string, commentText: string) => void;
}

const StoryViewerScreen: React.FC<StoryViewerScreenProps> = ({ initialUserId, onClose, userStories, onComment }) => {
  const orderedUserIds = userStories.map(us => us.userId);
  const initialUserIndex = orderedUserIds.findIndex(id => id === initialUserId);

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex !== -1 ? initialUserIndex : 0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [commentText, setCommentText] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const currentUserId = orderedUserIds[currentUserIndex];
  const user = USERS.find(u => u.id === currentUserId);
  const currentUserStories = userStories.find(us => us.userId === currentUserId);
  const currentStory = currentUserStories?.stories[currentStoryIndex];

  const goToNextStory = () => {
    if (currentUserStories && currentStoryIndex < currentUserStories.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < orderedUserIds.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1;
      const prevUserStories = userStories.find(us => us.userId === orderedUserIds[prevUserIndex]);
      setCurrentUserIndex(prevUserIndex);
      setCurrentStoryIndex(prevUserStories ? prevUserStories.stories.length - 1 : 0);
    }
  };
  
  useEffect(() => {
    if (!currentStory) return;
    const video = videoRef.current;

    const setLoopingOnLoad = () => {
      if (video) {
        video.loop = video.duration < currentStory.duration;
      }
    };

    if (currentStory.type === 'video' && video) {
      if (video.readyState >= 1) {
        setLoopingOnLoad();
      } else {
        video.addEventListener('loadedmetadata', setLoopingOnLoad, { once: true });
      }

      if (isPaused) {
        video.pause();
      } else {
        video.play().catch(e => console.error("Video playback failed.", e));
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (isPaused) {
      return () => {
        if (video) {
          video.removeEventListener('loadedmetadata', setLoopingOnLoad);
        }
      };
    }

    const startTime = performance.now();
    const durationMs = currentStory.duration * 1000;
    
    const remainingDurationMs = durationMs * (1 - progress);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressSincePlay = elapsed / durationMs;
      
      const newProgress = Math.min(1, progress + progressSincePlay);
      setProgress(newProgress);
      
      if (elapsed < remainingDurationMs) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(1);
        goToNextStory();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', setLoopingOnLoad);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentStory, isPaused]);

  useEffect(() => {
    setProgress(0);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }
  }, [currentStory]);


  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  const handleTapNavigation = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>, action: 'prev' | 'next') => {
    e.stopPropagation();
    setIsPaused(false);
    if (action === 'prev') {
        goToPrevStory();
    } else {
        goToNextStory();
    }
  }

  const handleSendComment = () => {
    if (commentText.trim() && currentStory) {
        onComment(currentUserId, currentStory.id, commentText.trim());
        setCommentText('');
    }
  };

  if (!currentStory || !currentUserStories || !user) {
    onClose();
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-dumm-dark z-50 flex flex-col justify-center select-none"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
    >
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-1">
          {currentUserStories.stories.map((story, index) => (
            <div key={story.id} className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: index < currentStoryIndex ? '100%' : (index === currentStoryIndex ? `${progress * 100}%` : '0%') }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center mt-3">
          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          <p className="font-bold text-white ml-3">{user.username}</p>
          <div className="flex-grow" />
           {currentStory.type === 'video' && (
              <button 
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
                  className="text-white mr-4 p-1"
                  aria-label={isMuted ? "Unmute" : "Mute"}
              >
                  {isMuted ? <VolumeOffIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}
              </button>
          )}
          <button
              onClick={(e) => handleTapNavigation(e, 'next')}
              className="text-white mr-3 p-1"
              aria-label="Next story"
          >
              <FastForwardIcon className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white text-3xl font-light leading-none" aria-label="Close stories">&times;</button>
        </div>
      </div>
      
      <div className="relative w-full aspect-[9/16] max-h-full mx-auto rounded-lg overflow-hidden bg-dumm-gray-200">
        {currentStory.type === 'image' ? (
          <img src={currentStory.url} className="w-full h-full object-cover" alt="story content" />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.url}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            style={{ display: currentStory.type === 'video' ? 'block' : 'none' }}
          />
        )}
      </div>

      <div className="absolute inset-0 flex z-10">
        <div className="w-1/3 h-full" onClick={(e) => handleTapNavigation(e, 'prev')}></div>
        <div className="w-1/3 h-full"></div>
        <div className="w-1/3 h-full" onClick={(e) => handleTapNavigation(e, 'next')}></div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/50 to-transparent"
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Send message..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendComment()}
            className="flex-1 bg-black/30 backdrop-blur-sm border border-white/50 rounded-full text-white placeholder-dumm-text-light px-4 py-2 focus:outline-none focus:border-white transition-colors"
          />
          {commentText.trim() && (
            <button 
              onClick={handleSendComment} 
              className="text-white font-bold"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewerScreen;