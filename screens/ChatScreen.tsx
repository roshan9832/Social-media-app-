
import React, { useState } from 'react';
import { Message } from '../types';
import { USERS, MESSAGES } from '../constants';
import { BackIcon, SendIcon } from '../components/Icons';

interface ChatScreenProps {
  conversationId: string;
  userId: string;
  onBack: () => void;
}

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const bubbleClasses = message.isSender
    ? "bg-dumm-pink self-end rounded-l-2xl rounded-tr-2xl"
    : "bg-dumm-gray-200 self-start rounded-r-2xl rounded-tl-2xl";

  return (
    <div className={`flex flex-col ${message.isSender ? 'items-end' : 'items-start'} mb-4`}>
        <div className={`max-w-xs md:max-w-md p-3 text-white ${bubbleClasses}`}>
        {message.imageUrl ? (
          <img src={message.imageUrl} alt="sent" className="rounded-lg" />
        ) : (
          <p>{message.text}</p>
        )}
      </div>
      <p className="text-xs text-dumm-text-dark mt-1 px-1">{message.timestamp}</p>
    </div>
  );
};

const ChatScreen: React.FC<ChatScreenProps> = ({ conversationId, userId, onBack }) => {
  const user = USERS.find(u => u.id === userId);
  const [messages, setMessages] = useState<Message[]>(MESSAGES[conversationId] || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    const message: Message = {
      id: `m${Date.now()}`,
      text: newMessage,
      isSender: true,
      timestamp: 'Just now',
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center bg-dumm-gray-100/80 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6 text-white" />
        </button>
        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover ml-4" />
        <div className="ml-3">
          <h2 className="font-bold text-white">{user.name}</h2>
          <p className="text-xs text-dumm-text-dark">Online</p>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto flex flex-col">
        <div className="text-center my-4">
            <p className="text-sm text-dumm-text-dark">TODAY</p>
        </div>
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </main>

      <footer className="p-4 bg-dumm-dark sticky bottom-0">
        <div className="flex items-center bg-dumm-gray-100 rounded-full p-2">
          <input
            type="text"
            placeholder="Type something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-white placeholder-dumm-text-dark px-4 focus:outline-none"
          />
          <button onClick={handleSend} className="bg-dumm-pink rounded-full p-3">
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;
