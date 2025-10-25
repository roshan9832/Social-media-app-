
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col h-full justify-center p-8 text-dumm-text-light">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold italic">Dumm</h1>
        <p className="text-dumm-text-dark mt-2">Sign in to continue</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="text-sm font-medium text-dumm-text-dark">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="janedoe"
            className="w-full mt-2 bg-dumm-gray-100 border-2 border-dumm-gray-200 rounded-lg p-3 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
          />
        </div>
        <div>
          <label htmlFor="password-login" className="text-sm font-medium text-dumm-text-dark">Password</label>
          <input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full mt-2 bg-dumm-gray-100 border-2 border-dumm-gray-200 rounded-lg p-3 focus:outline-none focus:border-dumm-pink text-dumm-text-light"
          />
        </div>
      </div>
      
      <div className="text-right mt-4">
        <a href="#" className="text-sm font-medium text-dumm-blue hover:underline">Forgot password?</a>
      </div>

      <button
        onClick={onLogin}
        className="w-full bg-dumm-pink text-white font-bold py-3 rounded-lg mt-8 hover:bg-opacity-90 transition-all duration-300"
      >
        Log In
      </button>

      <div className="text-center mt-12">
        <p className="text-sm text-dumm-text-dark">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-bold text-dumm-blue hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
