import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { signIn, signUp, signOut } from './store/authSlice';

const Auth: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');

  const handleAuthAction = () => {
    if (authMode === 'signIn') {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {authMode === 'signIn' ? 'Login' : 'Sign Up'}
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {loading && <p className="text-center text-blue-600">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
        </div>
        <button
          onClick={handleAuthAction}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {authMode === 'signIn' ? 'Log In' : 'Sign Up'}
        </button>
        <button
          onClick={() => setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn')}
          className="w-full px-4 py-2 font-semibold text-blue-600 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          {authMode === 'signIn' ? 'Switch to Sign Up' : 'Switch to Login'}
        </button>
        {user && (
          <button
            onClick={() => dispatch(signOut())}
            className="w-full px-4 py-2 font-semibold text-red-600 bg-transparent border border-red-600 rounded-lg hover:bg-red-50"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
