
import React from 'react';
import { Notification, Post } from '../types';
import { USERS, NOTIFICATIONS } from '../constants';
import { BackIcon } from '../components/Icons';

interface NotificationsScreenProps {
  posts: Post[];
  onBack: () => void;
  onProfileClick: (userId: string) => void;
}

const NotificationItem: React.FC<{ notification: Notification, post: Post | null | undefined, onProfileClick: (userId: string) => void }> = ({ notification, post, onProfileClick }) => {
  const fromUser = USERS.find(u => u.id === notification.fromUserId);
  if (!fromUser) return null;

  let message = '';
  switch(notification.type) {
    case 'follow':
      message = 'started following you.';
      break;
    case 'like':
      message = 'liked your post.';
      break;
    case 'comment':
      message = 'commented on your post.';
      break;
  }

  return (
    <div className="flex items-center py-3 px-4">
      <img 
        src={fromUser.avatarUrl} 
        alt={fromUser.name} 
        className="w-12 h-12 rounded-full object-cover cursor-pointer" 
        onClick={() => onProfileClick(fromUser.id)}
      />
      <div className="flex-1 ml-4 text-sm">
        <p className="text-dumm-text-light">
          <span className="font-bold cursor-pointer" onClick={() => onProfileClick(fromUser.id)}>{fromUser.name}</span> {message}
        </p>
        <p className="text-xs text-dumm-text-dark">{notification.timestamp}</p>
      </div>
      {notification.type === 'follow' ? (
        <button className="bg-dumm-pink text-white text-sm font-semibold px-4 py-1.5 rounded-lg">Follow</button>
      ) : post && (
        <img src={post.imageUrl} alt="post" className="w-12 h-12 object-cover rounded-lg"/>
      )}
    </div>
  );
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ posts, onBack, onProfileClick }) => {
  return (
    <div className="text-dumm-text-light">
      <header className="p-4 flex items-center space-x-4">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl flex-1">Notifications</h2>
      </header>

      <main>
        {NOTIFICATIONS.map(notif => {
          const post = notif.postId ? posts.find(p => p.id === notif.postId) : null;
          return <NotificationItem key={notif.id} notification={notif} post={post} onProfileClick={onProfileClick} />
        })}
      </main>
    </div>
  );
};

export default NotificationsScreen;