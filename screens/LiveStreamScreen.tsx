import React, { useState, useRef, useEffect } from 'react';
import { Post, User, LiveComment } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { BackIcon, EyeIcon, LikeIcon, SendIcon } from '../components/Icons';

interface LiveStreamScreenProps {
  post: Post;
  onBack: () => void;
  isHost: boolean;
}

const LiveCommentItem: React.FC<{ comment: LiveComment }> = ({ comment }) => {
    const user = USERS.find(u => u.id === comment.userId);
    if (!user) return null;

    return (
        <div className="flex items-start space-x-2 p-2 rounded-lg bg-black/20 mb-2">
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            <div>
                <p className="font-bold text-sm text-white">{user.username}</p>
                <p className="text-sm text-dumm-text-light">{comment.text}</p>
            </div>
        </div>
    );
}

const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({ post, onBack, isHost }) => {
    const streamer = USERS.find(u => u.id === post.userId);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [liveComments, setLiveComments] = useState<LiveComment[]>(post.liveComments || []);
    const [newComment, setNewComment] = useState('');
    const commentsContainerRef = useRef<HTMLDivElement>(null);
    const [showStopDialog, setShowStopDialog] = useState(false);
    
    useEffect(() => {
        // Auto-scroll to the bottom of the comments
        if(commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
        }
    }, [liveComments]);

    const handleSendComment = () => {
        if (newComment.trim()) {
            const comment: LiveComment = {
                id: `lc${Date.now()}`,
                userId: CURRENT_USER_ID,
                text: newComment.trim(),
            };
            setLiveComments(prev => [...prev, comment]);
            setNewComment('');
        }
    };

    if (!streamer) return null;

    return (
        <div className="relative h-screen w-full bg-black flex flex-col">
            <video
                ref={videoRef}
                src={post.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'} // Placeholder stream
                loop
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60"></div>

            <header className="relative z-10 p-4 flex justify-between items-start">
                <div className="flex items-center bg-black/30 backdrop-blur-sm p-2 rounded-full">
                    <img src={streamer.avatarUrl} alt={streamer.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="ml-3">
                        <p className="font-bold text-white">{streamer.username}</p>
                        <p className="text-xs text-dumm-text-light">{post.caption}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full flex items-center text-white font-semibold">
                        <EyeIcon className="w-5 h-5 mr-2"/>
                        {post.viewerCount?.toLocaleString()}
                    </div>
                    {isHost ? (
                         <button onClick={() => setShowStopDialog(true)} className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm">
                            Stop
                        </button>
                    ) : (
                         <button onClick={onBack} className="bg-black/30 backdrop-blur-sm p-2 rounded-full">
                             <BackIcon className="w-6 h-6 text-white rotate-45" />
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1"></div>

            <footer className="relative z-10 p-4">
                <div ref={commentsContainerRef} className="h-48 overflow-y-auto mb-2 pr-2">
                    {liveComments.map(comment => <LiveCommentItem key={comment.id} comment={comment} />)}
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex-1 flex items-center bg-black/30 backdrop-blur-sm rounded-full p-1">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                            className="flex-1 bg-transparent text-white placeholder-dumm-text-dark px-4 focus:outline-none"
                        />
                        <button onClick={handleSendComment} className={`p-2 rounded-full transition-colors ${newComment ? 'bg-dumm-pink' : 'bg-transparent'}`}>
                            <SendIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                     <button className="bg-black/30 backdrop-blur-sm p-3 rounded-full">
                        <LikeIcon className="w-6 h-6 text-white"/>
                    </button>
                </div>
            </footer>
             {showStopDialog && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 z-50">
                    <div className="bg-dumm-gray-200 rounded-lg p-6 text-center shadow-lg w-full max-w-sm">
                        <h3 className="font-bold text-lg text-dumm-text-light">End your live video?</h3>
                        <p className="text-sm text-dumm-text-dark mt-2 mb-6">Are you sure you want to end your live video?</p>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => {
                                    setShowStopDialog(false);
                                    onBack();
                                }}
                                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                End
                            </button>
                            <button
                                onClick={() => setShowStopDialog(false)}
                                className="w-full bg-transparent text-dumm-text-light font-semibold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default LiveStreamScreen;