
import React, { useState } from 'react';

interface SignUpScreenProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col h-full justify-center p-8 text-dumm-text-light">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold italic">Dumm</h1>
        <p className="text-dumm-text-dark mt-2">Create your account</p>
      </div>

      <div className="space-y-5">
         <div>
          <label htmlFor="name" className="text-sm font-medium text-dumm-text-dark">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full mt-2 bg-dumm-gray-100 border-2 border-dumm-gray-200 rounded-lg p-3 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
          />
        </div>
        <div>
          <label htmlFor="username-signup" className="text-sm font-medium text-dumm-text-dark">Username</label>
          <input
            id="username-signup"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="janedoe"
            className="w-full mt-2 bg-dumm-gray-100 border-2 border-dumm-gray-200 rounded-lg p-3 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
          />
        </div>
        <div>
          <label htmlFor="password-signup" className="text-sm font-medium text-dumm-text-dark">Password</label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full mt-2 bg-dumm-gray-100 border-2 border-dumm-gray-200 rounded-lg p-3 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
          />
        </div>
      </div>
      
      <button
        onClick={onSignUp}
        className="w-full bg-dumm-pink text-white font-bold py-3 rounded-lg mt-8 hover:bg-opacity-90 transition-all duration-300"
      >
        Sign Up
      </button>

      <div className="text-center mt-10">
        <p className="text-sm text-dumm-text-dark">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-bold text-dumm-blue hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
