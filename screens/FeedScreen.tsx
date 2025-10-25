
import React, { useState, useRef } from 'react';
import { Post, Story as StoryType, User, Comment as CommentType } from '../types';
import { USERS, STORIES, CURRENT_USER_ID } from '../constants';
import { LikeIcon, CommentIcon, ShareIcon, MoreIcon, MessagesIcon } from '../components/Icons';

type StoryProps = {
  story: StoryType;
};
const Story: React.FC<StoryProps> = ({ story }) => {
  const user = USERS.find(u => u.id === story.userId);
  if (!user) return null;
  return (
    <div className="flex-shrink-0 text-center w-20">
      <div className="relative p-0.5 border-2 border-dumm-pink rounded-full">
        <img className="w-16 h-16 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
      </div>
      <p className="text-xs text-dumm-text-light mt-1 truncate">{user.name}</p>
    </div>
  );
};

type ReplyItemProps = {
  reply: CommentType;
  onProfileClick: (userId: string) => void;
};
const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onProfileClick }) => {
  const user = USERS.find(u => u.id === reply.userId);
  if (!user) return null;
  return (
    <div className="text-dumm-text-light text-sm flex items-start space-x-2">
      <img 
        src={user.avatarUrl} 
        alt={user.name} 
        className="w-6 h-6 rounded-full object-cover mt-0.5 cursor-pointer flex-shrink-0"
        onClick={() => onProfileClick(user.id)} 
      />
      <div className="break-words">
        <span className="font-bold cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.username}</span>
        <span className="ml-1">{reply.text}</span>
      </div>
    </div>
  );
};

type CommentItemProps = {
  comment: CommentType;
  onProfileClick: (userId: string) => void;
  onReply: (parentCommentId: string, replyText: string) => void;
};
const CommentItem: React.FC<CommentItemProps> = ({ comment, onProfileClick, onReply }) => {
  const user = USERS.find(u => u.id === comment.userId);
  const currentUser = USERS.find(u => u.id === CURRENT_USER_ID);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);

  if (!user) return null;

  const handlePostReply = () => {
    if (replyText.trim()) {
        onReply(comment.id, replyText.trim());
        setReplyText('');
        setIsReplying(false);
        if (!areRepliesVisible) {
            setAreRepliesVisible(true);
        }
    }
  };

  return (
    <div>
        <div className="text-dumm-text-light text-sm flex items-start space-x-2">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover mt-0.5 cursor-pointer flex-shrink-0"
                onClick={() => onProfileClick(user.id)} 
            />
            <div className="flex-1">
                <div className="break-words">
                    <span className="font-bold cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.username}</span>
                    <span className="ml-1">{comment.text}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-dumm-text-dark mt-1">
                    <button onClick={() => setIsReplying(!isReplying)} className="font-semibold">Reply</button>
                </div>
            </div>
        </div>

        <div className="pl-9">
            {isReplying && (
                <div className="flex items-center mt-2 space-x-2">
                    <img 
                        src={currentUser?.avatarUrl} 
                        alt={currentUser?.name} 
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 flex items-center bg-dumm-gray-200 rounded-full">
                        <input 
                            type="text" 
                            placeholder={`Replying to ${user.username}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handlePostReply();
                                }
                            }}
                            className="bg-transparent w-full text-dumm-text-light placeholder-dumm-text-dark px-3 py-1 text-xs focus:outline-none"
                            autoFocus
                        />
                        {replyText && (
                            <button onClick={handlePostReply} className="text-dumm-blue font-semibold pr-3 text-xs">Post</button>
                        )}
                    </div>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {areRepliesVisible ? (
                        <>
                            <button onClick={() => setAreRepliesVisible(false)} className="text-xs text-dumm-text-dark font-semibold mb-2">
                                Hide replies
                            </button>
                            <div className="space-y-2">
                                {comment.replies.map(reply => (
                                    <ReplyItem key={reply.id} reply={reply} onProfileClick={onProfileClick} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <button onClick={() => setAreRepliesVisible(true)} className="text-xs text-dumm-text-dark font-semibold">
                           View {comment.replies.length} {comment.replies.length > 1 ? 'replies' : 'reply'}
                        </button>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};


type PostCardProps = {
  post: Post;
  onProfileClick: (userId: string) => void;
};
const PostCard: React.FC<PostCardProps> = ({ post, onProfileClick }) => {
  const user = USERS.find(u => u.id === post.userId);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const currentUser = USERS.find(u => u.id === CURRENT_USER_ID);

  if (!user) return null;

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
    }
    setShowLikeAnimation(true);
    setTimeout(() => {
      setShowLikeAnimation(false);
    }, 800);
  };
  
  const handleVideoClick = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }
  };

  const handlePostComment = () => {
    if (newComment.trim() && currentUser) {
      const newCommentObj: CommentType = {
        id: `c${Date.now()}`,
        userId: currentUser.id,
        text: newComment.trim(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setIsCommentsExpanded(true);
    }
  };

  const handlePostReply = (parentCommentId: string, replyText: string) => {
    if (replyText.trim() && currentUser) {
      const newReply: CommentType = {
        id: `r${Date.now()}`,
        userId: currentUser.id,
        text: replyText.trim(),
      };

      const addReplyToComment = (commentsList: CommentType[]): CommentType[] => {
        return commentsList.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          return comment;
        });
      };

      setComments(addReplyToComment(comments));
    }
  };

  return (
    <div className="bg-dumm-gray-100 rounded-lg mb-4">
      <div className="flex items-center p-3">
        <img 
          className="w-10 h-10 rounded-full object-cover cursor-pointer" 
          src={user.avatarUrl} 
          alt={user.name} 
          onClick={() => onProfileClick(user.id)}
        />
        <div className="ml-3 flex-1">
          <p 
            className="font-bold text-dumm-text-light cursor-pointer"
            onClick={() => onProfileClick(user.id)}
          >
            {user.name}
          </p>
          <p className="text-xs text-dumm-text-dark">{post.timestamp}</p>
        </div>
        {post.isLive && (
          <div className="bg-dumm-pink text-white text-xs font-bold px-2 py-1 rounded-md">LIVE</div>
        )}
        <MoreIcon className="w-6 h-6 text-dumm-text-dark ml-2" />
      </div>
      <div className="relative" onDoubleClick={handleDoubleClick}>
         {post.videoUrl ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-auto object-cover"
              src={post.videoUrl}
              loop
              muted={isMuted}
              playsInline
              poster={post.imageUrl}
              onClick={handleVideoClick}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                <svg className="w-16 h-16 text-white/70 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <button onClick={() => setIsMuted(!isMuted)} className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full z-10">
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.108 12 5v14c0 .892-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.108 12 5v14c0 .892-1.077 1.337-1.707.707L5.586 15z" /></svg>
              )}
            </button>
          </>
        ) : (
          <img 
            className="w-full h-auto object-cover" 
            src={post.imageUrl} 
            alt="Post" 
          />
        )}
        {showLikeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <LikeIcon className="w-24 h-24 text-white fill-current drop-shadow-lg animate-like-pop" />
            </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <LikeIcon 
              className={`w-7 h-7 cursor-pointer transition-transform duration-200 ease-in-out active:scale-125 ${isLiked ? 'text-dumm-pink fill-current' : 'text-dumm-text-light'}`} 
              onClick={() => setIsLiked(!isLiked)} 
            />
            <span className="text-dumm-text-light">{isLiked ? post.likes + 1 : post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CommentIcon className="w-7 h-7 text-dumm-text-light" />
            <span className="text-dumm-text-light">{comments.length}</span>
          </div>
          <ShareIcon className="w-7 h-7 text-dumm-text-light" />
        </div>
        <div className="mt-2 text-dumm-text-light text-sm">
          <span className="font-bold cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.username}</span>
          <span className="ml-1" dangerouslySetInnerHTML={{ __html: post.caption.replace(/#\w+/g, '<span class="text-dumm-blue">$&</span>').replace(/@\w+/g, '<span class="text-dumm-blue">$&</span>') }}></span>
        </div>

        {comments.length > 0 && (
          <div className="mt-2 space-y-2">
            {(isCommentsExpanded ? comments : comments.slice(0, 2)).map(comment => (
                <CommentItem key={comment.id} comment={comment} onProfileClick={onProfileClick} onReply={handlePostReply} />
            ))}
          </div>
        )}
        
        {comments.length > 2 && !isCommentsExpanded && (
          <button onClick={() => setIsCommentsExpanded(true)} className="text-dumm-text-dark text-sm mt-1">
            View all {comments.length} comments
          </button>
        )}
        
        <div className="flex items-center mt-3 space-x-3">
          <img 
            src={currentUser?.avatarUrl} 
            alt={currentUser?.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 flex items-center bg-dumm-gray-200 rounded-full">
             <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePostComment();
                }
              }}
              className="bg-transparent w-full text-dumm-text-light placeholder-dumm-text-dark px-4 py-1.5 text-sm focus:outline-none"
            />
            {newComment && (
                <button onClick={handlePostComment} className="text-dumm-blue font-semibold pr-4 text-sm">Post</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeedScreenProps {
  posts: Post[];
  onProfileClick: (userId: string) => void;
}

const FeedScreen: React.FC<FeedScreenProps> = ({ posts, onProfileClick }) => {
  return (
    <div className="text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold italic">Dumm</h1>
        <div className="flex items-center space-x-4">
          <LikeIcon className="w-7 h-7" />
          <MessagesIcon className="w-7 h-7" />
        </div>
      </header>

      <div className="px-4 pb-2 border-b border-dumm-gray-300">
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          {STORIES.map(story => (
            <Story key={story.id} story={story} />
          ))}
        </div>
      </div>
      
      <main className="p-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onProfileClick={onProfileClick} />
        ))}
      </main>
    </div>
  );
};

export default FeedScreen;