
import React from 'react';
import { User, Post } from '../types';
import { USERS, CURRENT_USER_ID } from '../constants';
import { BackIcon, MoreIcon, GridIcon, VideoIcon } from '../components/Icons';

interface ProfileScreenProps {
  userId: string;
  posts: Post[];
  onBack: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId, posts, onBack, onEditProfileClick, onSettingsClick }) => {
  const user = USERS.find(u => u.id === userId);
  const userPosts = posts.filter(p => p.userId === userId);

  if (!user) {
    return (
      <div className="p-4 text-white">
        <p>User not found.</p>
        <button onClick={onBack} className="text-dumm-pink mt-4">Go Back</button>
      </div>
    );
  }

  const isCurrentUser = userId === CURRENT_USER_ID;

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
            <div className="flex justify-around py-2">
                <button className="p-2 border-t-2 border-white">
                    <GridIcon className="w-6 h-6 text-white"/>
                </button>
                <button className="p-2">
                    <VideoIcon className="w-6 h-6 text-dumm-text-dark"/>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {userPosts.map(post => (
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
          ))}
        </div>

      </main>
    </div>
  );
};

export default ProfileScreen;