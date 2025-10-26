
import React, { useState, useRef, useEffect } from 'react';
import { Post, Story as StoryType, User, Comment as CommentType, Screen } from '../types';
import { USERS, STORIES, CURRENT_USER_ID } from '../constants';
import { LikeIcon, CommentIcon, ShareIcon, MoreIcon, MessagesIcon, BookmarkIcon, NotificationIcon, PlayIcon, PauseIcon, VolumeOffIcon, VolumeUpIcon, PlayCircleIcon, EyeIcon } from '../components/Icons';

type StoryProps = {
  story: StoryType;
  isUserLive: boolean;
};
const Story: React.FC<StoryProps> = ({ story, isUserLive }) => {
  const user = USERS.find(u => u.id === story.userId);
  if (!user) return null;
  return (
    <div className="flex-shrink-0 text-center w-20">
      <div className={`relative p-0.5 border-2 ${isUserLive ? 'bg-gradient-to-tr from-dumm-pink to-yellow-400 border-transparent' : 'border-dumm-pink'} rounded-full`}>
        <img className="w-16 h-16 rounded-full object-cover border-2 border-dumm-dark" src={user.avatarUrl} alt={user.name} />
         {isUserLive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-dumm-pink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-dumm-dark uppercase">LIVE</div>
        )}
      </div>
      <p className="text-xs text-dumm-text-light mt-2 truncate">{user.name}</p>
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
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onLiveStreamClick: (postId: string) => void;
};
const PostCard: React.FC<PostCardProps> = ({ post, onProfileClick, isBookmarked, onToggleBookmark, onLiveStreamClick }) => {
  const user = USERS.find(u => u.id === post.userId);
  const [isLiked, setIsLiked] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const currentUser = USERS.find(u => u.id === CURRENT_USER_ID);
  const [animateBookmark, setAnimateBookmark] = useState(false);

  if (!user) return null;

  const handleLikeClick = () => {
    if (!isLiked) {
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
    }
    setIsLiked(!isLiked);
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
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

  const handleBookmarkClick = () => {
    onToggleBookmark(post.id);
    setAnimateBookmark(true);
    setTimeout(() => setAnimateBookmark(false), 200);
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
        <MoreIcon className="w-6 h-6 text-dumm-text-dark ml-2" />
      </div>
       <div className="relative" onDoubleClick={!post.isLive ? handleDoubleClick : undefined} onClick={post.isLive ? () => onLiveStreamClick(post.id) : undefined}>
         {post.isLive ? (
          <div className="cursor-pointer">
            <img 
              className="w-full h-auto object-cover" 
              src={post.imageUrl} 
              alt="Live Stream Thumbnail" 
            />
            <div className="absolute top-4 left-4 bg-dumm-pink text-white text-xs font-bold px-2 py-1 rounded-md uppercase">LIVE</div>
            <div className="absolute top-4 right-4 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-md flex items-center">
              <EyeIcon className="w-4 h-4 mr-1.5" />
              {post.viewerCount?.toLocaleString()}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PlayCircleIcon className="w-20 h-20 text-white/70" />
            </div>
          </div>
        ) : post.videoUrl ? (
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
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <button onClick={handleVideoClick} className="bg-black/50 p-2 rounded-full">
                {isPlaying ? <PauseIcon className="h-5 w-5 text-white" /> : <PlayIcon className="h-5 w-5 text-white" />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="bg-black/50 p-2 rounded-full">
                {isMuted ? (
                  <VolumeOffIcon className="h-5 w-5 text-white" />
                ) : (
                  <VolumeUpIcon className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
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
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <LikeIcon 
                className={`w-7 h-7 cursor-pointer ${isLiked ? 'text-dumm-pink fill-current' : 'text-dumm-text-light'} ${animateLike ? 'animate-like-button-animation' : ''}`} 
                onClick={handleLikeClick} 
              />
              <span className="text-dumm-text-light">{isLiked ? post.likes + 1 : post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CommentIcon className="w-7 h-7 text-dumm-text-light" />
              <span className="text-dumm-text-light">{comments.length}</span>
            </div>
            <ShareIcon className="w-7 h-7 text-dumm-text-light" />
          </div>
          <div className="flex-1" />
          <BookmarkIcon 
            onClick={handleBookmarkClick}
            className={`w-7 h-7 cursor-pointer ${isBookmarked ? 'text-dumm-text-light fill-current' : 'text-dumm-text-light'} ${animateBookmark ? 'animate-button-pop' : ''}`}
          />
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
  bookmarkedPostIds: string[];
  onToggleBookmark: (postId: string) => void;
  navigate: (screen: Screen) => void;
  onLiveStreamClick: (postId: string) => void;
}

const POSTS_PER_PAGE = 3;

const FeedScreen: React.FC<FeedScreenProps> = ({ posts, onProfileClick, bookmarkedPostIds, onToggleBookmark, navigate, onLiveStreamClick }) => {
  const livePostUserIds = posts.filter(p => p.isLive).map(p => p.userId);
  
  const [page, setPage] = useState(1);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Load initial posts
  useEffect(() => {
    const initialPosts = posts.slice(0, POSTS_PER_PAGE);
    setVisiblePosts(initialPosts);
    setHasMore(posts.length > POSTS_PER_PAGE);
  }, [posts]);

  // Load more posts when page changes, appending them to the list
  useEffect(() => {
    if (page === 1) return; // Initial posts are already loaded

    const fetchMorePosts = () => {
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const newPosts = posts.slice(startIndex, endIndex);

      if (newPosts.length > 0) {
        // Append new posts instead of re-calculating the whole list
        setVisiblePosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      
      if (endIndex >= posts.length) {
        setHasMore(false);
      }
    };

    fetchMorePosts();
  }, [page, posts]);

  // IntersectionObserver to trigger loading more posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore]);

  return (
    <div className="text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold italic">Dumm</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(Screen.Notifications)}>
            <NotificationIcon className="w-7 h-7 text-dumm-text-light" />
          </button>
          <button onClick={() => navigate(Screen.Messages)}>
            <MessagesIcon className="w-7 h-7 text-dumm-text-light" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-2 border-b border-dumm-gray-300">
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
          {STORIES.map(story => (
            <Story key={story.id} story={story} isUserLive={livePostUserIds.includes(story.userId)} />
          ))}
        </div>
      </div>
      
      <main className="p-4">
        {visiblePosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onProfileClick={onProfileClick}
            isBookmarked={bookmarkedPostIds.includes(post.id)}
            onToggleBookmark={onToggleBookmark}
            onLiveStreamClick={onLiveStreamClick}
          />
        ))}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center p-4">
            <div className="w-8 h-8 border-t-2 border-dumm-pink rounded-full animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedScreen;
