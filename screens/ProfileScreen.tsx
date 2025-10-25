
import React, { useState } from 'react';
import { User, Post } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { BackIcon, MoreIcon, GridIcon, VideoIcon, BookmarkIcon } from '../components/Icons';

interface ProfileScreenProps {
  userId: string;
  posts: Post[];
  onBack: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
  bookmarkedPostIds: string[];
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId, posts, onBack, onEditProfileClick, onSettingsClick, bookmarkedPostIds }) => {
  const user = USERS.find(u => u.id === userId);
  const userPosts = posts.filter(p => p.userId === userId);
  const [activeTab, setActiveTab] = useState<'grid' | 'videos' | 'saved'>('grid');

  if (!user) {
    return (
      <div className="p-4 text-white">
        <p>User not found.</p>
        <button onClick={onBack} className="text-dumm-pink mt-4">Go Back</button>
      </div>
    );
  }

  const isCurrentUser = userId === CURRENT_USER_ID;
  const bookmarkedPosts = posts.filter(post => bookmarkedPostIds.includes(post.id));

  const renderPosts = () => {
    let postsToRender: Post[] = [];
    switch (activeTab) {
      case 'grid':
        postsToRender = userPosts;
        break;
      case 'videos':
        postsToRender = userPosts.filter(p => p.videoUrl);
        break;
      case 'saved':
        postsToRender = isCurrentUser ? bookmarkedPosts : [];
        break;
      default:
        postsToRender = userPosts;
    }

    return postsToRender.map(post => (
      <div key={post.id} className="aspect-square relative">
        <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
        {post.videoUrl && (
          <div className="absolute top-2 right-2">
              <VideoIcon className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        )}
        {post.isLive && (
          <div className="absolute top-2 left-2 bg-dumm-pink text-white text-xs font-bold px-2 py-1 rounded-md">LIVE</div>
        )}
      </div>
    ));
  };


  return (
    <div className="text-dumm-text-light">
      <header className="p-4 flex justify-between items-center">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold">{user.username}</h2>
        <button onClick={onSettingsClick}>
            <MoreIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4">
        <div className="flex items-center">
          <div className="relative p-0.5 border-2 border-dumm-pink rounded-full">
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
          </div>
          <div className="flex-1 flex justify-around items-center ml-4">
            <div className="text-center">
              <p className="font-bold text-lg">{userPosts.length}</p>
              <p className="text-sm text-dumm-text-dark">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user.followers}</p>
              <p className="text-sm text-dumm-text-dark">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user.following}</p>
              <p className="text-sm text-dumm-text-dark">Following</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-bold">{user.name}</p>
          <p className="text-sm">{user.bio}</p>
        </div>
        <div className="flex items-center mt-4 space-x-2">
          {isCurrentUser ? (
             <button onClick={onEditProfileClick} className="flex-1 bg-dumm-gray-200 py-2 rounded-lg font-semibold text-sm">Edit Profile</button>
          ) : (
             <>
               <button className="flex-1 bg-dumm-pink text-white py-2 rounded-lg font-semibold text-sm">Follow</button>
               <button className="flex-1 bg-dumm-gray-200 py-2 rounded-lg font-semibold text-sm">Message</button>
             </>
          )}
        </div>
        
        {/* Stories would go here if implemented */}

        <div className="mt-6 border-t border-dumm-gray-300">
            <div className="flex justify-around">
                <button onClick={() => setActiveTab('grid')} className={`flex-1 p-2 ${activeTab === 'grid' ? 'border-t-2 border-white' : ''}`}>
                    <GridIcon className={`w-6 h-6 mx-auto ${activeTab === 'grid' ? 'text-white' : 'text-dumm-text-dark'}`}/>
                </button>
                <button onClick={() => setActiveTab('videos')} className={`flex-1 p-2 ${activeTab === 'videos' ? 'border-t-2 border-white' : ''}`}>
                    <VideoIcon className={`w-6 h-6 mx-auto ${activeTab === 'videos' ? 'text-white' : 'text-dumm-text-dark'}`}/>
                </button>
                 {isCurrentUser && (
                  <button onClick={() => setActiveTab('saved')} className={`flex-1 p-2 ${activeTab === 'saved' ? 'border-t-2 border-white' : ''}`}>
                    <BookmarkIcon className={`w-6 h-6 mx-auto ${activeTab === 'saved' ? 'text-white' : 'text-dumm-text-dark'}`} />
                  </button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {renderPosts()}
        </div>

      </main>
    </div>
  );
};

export default ProfileScreen;