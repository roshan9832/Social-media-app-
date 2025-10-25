
import React, { useState } from 'react';
import { User } from '../types';
import { USERS } from '../constants';
import { BackIcon } from '../components/Icons';

interface EditProfileScreenProps {
  userId: string;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ userId, onBack, onSave }) => {
  const user = USERS.find(u => u.id === userId);

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  if (!user) {
    return (
      <div className="p-4 text-white">
        <p>User not found.</p>
        <button onClick={onBack} className="text-dumm-pink mt-4">Go Back</button>
      </div>
    );
  }

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name,
      username,
      bio,
    };
    onSave(updatedUser);
  };

  return (
    <div className="text-dumm-text-light">
      <header className="p-4 flex justify-between items-center">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg">Edit Profile</h2>
        <button onClick={handleSave} className="font-bold text-dumm-blue">
          Save
        </button>
      </header>

      <main className="p-4 flex flex-col items-center">
        <div className="relative">
          <img src={user.avatarUrl} alt={user.name} className="w-28 h-28 rounded-full object-cover" />
        </div>
        <button className="text-dumm-blue font-semibold mt-3 text-sm">
          Change profile photo
        </button>

        <div className="w-full mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-xs text-dumm-text-dark">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-dumm-gray-300 py-2 focus:outline-none focus:border-dumm-text-light text-dumm-text-light"
            />
          </div>
          <div>
            <label htmlFor="username" className="text-xs text-dumm-text-dark">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-dumm-gray-300 py-2 focus:outline-none focus:border-dumm-text-light text-dumm-text-light"
            />
          </div>
          <div>
            <label htmlFor="bio" className="text-xs text-dumm-text-dark">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border-b border-dumm-gray-300 py-2 focus:outline-none focus:border-dumm-text-light text-dumm-text-light h-24 resize-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfileScreen;
