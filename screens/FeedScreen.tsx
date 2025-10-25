
import React, { useState } from 'react';
import { Post, Story as StoryType, User } from '../types';
import { USERS, STORIES } from '../constants';
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

type PostCardProps = {
  post: Post;
  onProfileClick: (userId: string) => void;
};
const PostCard: React.FC<PostCardProps> = ({ post, onProfileClick }) => {
  const user = USERS.find(u => u.id === post.userId);
  const [isLiked, setIsLiked] = useState(false);

  if (!user) return null;

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
      <img className="w-full h-auto object-cover" src={post.imageUrl} alt="Post" />
      <div className="p-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <LikeIcon 
              className={`w-7 h-7 cursor-pointer ${isLiked ? 'text-dumm-pink fill-current' : 'text-dumm-text-light'}`} 
              onClick={() => setIsLiked(!isLiked)} 
            />
            <span className="text-dumm-text-light">{isLiked ? post.likes + 1 : post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CommentIcon className="w-7 h-7 text-dumm-text-light" />
            <span className="text-dumm-text-light">{post.comments.length}</span>
          </div>
          <ShareIcon className="w-7 h-7 text-dumm-text-light" />
        </div>
        <div className="mt-2 text-dumm-text-light text-sm">
          <span className="font-bold cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.username}</span>
          <span className="ml-1" dangerouslySetInnerHTML={{ __html: post.caption.replace(/#\w+/g, '<span class="text-dumm-blue">$&</span>').replace(/@\w+/g, '<span class="text-dumm-blue">$&</span>') }}></span>
        </div>
        {post.comments.length > 0 && (
          <p className="text-dumm-text-dark text-sm mt-1">View all {post.comments.length} comments</p>
        )}
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