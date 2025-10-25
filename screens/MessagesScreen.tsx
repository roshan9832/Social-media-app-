
import React from 'react';
import { Conversation } from '../types';
import { USERS, CONVERSATIONS } from '../constants';
import { BackIcon } from '../components/Icons';

interface MessagesScreenProps {
  onBack: () => void;
  onChatClick: (conversationId: string, userId: string) => void;
}

const ConversationItem: React.FC<{ conversation: Conversation, onClick: () => void }> = ({ conversation, onClick }) => {
  const user = USERS.find(u => u.id === conversation.userId);
  if (!user) return null;

  return (
    <div onClick={onClick} className="flex items-center py-4 px-2 cursor-pointer hover:bg-dumm-gray-200 rounded-lg">
      <div className="relative">
        <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
        {conversation.unreadCount > 0 && 
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-dumm-pink" />
        }
      </div>
      <div className="flex-1 ml-4 border-b border-dumm-gray-300 pb-4">
        <div className="flex justify-between">
          <p className="font-bold text-dumm-text-light">{user.name}</p>
          <p className="text-xs text-dumm-text-dark">{conversation.timestamp}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-dumm-text-dark truncate w-52">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <span className="bg-dumm-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MessagesScreen: React.FC<MessagesScreenProps> = ({ onBack, onChatClick }) => {
  return (
    <div className="text-dumm-text-light">
      <header className="p-4 flex items-center space-x-4">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl flex-1">Messages</h2>
      </header>

      <div className="px-4">
        <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-dumm-gray-200 text-dumm-text-light placeholder-dumm-text-dark px-4 py-2 rounded-lg focus:outline-none"
        />
      </div>

      <main className="p-2">
        {CONVERSATIONS.map(conv => (
          <ConversationItem key={conv.id} conversation={conv} onClick={() => onChatClick(conv.id, conv.userId)} />
        ))}
      </main>
    </div>
  );
};

export default MessagesScreen;
