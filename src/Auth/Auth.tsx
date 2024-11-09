import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { signIn, signUp } from './authSlice';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');

  useEffect(() => {
    if (user) {
      // Redirect to news-feed if user is authenticated
      navigate('/news-feed');
    }
  }, [user, navigate]);

  const handleAuthAction = () => {
    if (authMode === 'signIn') {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password, username, name }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {authMode === 'signIn' ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {authMode === 'signUp' && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={handleAuthAction}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Loading...' : authMode === 'signIn' ? 'Log In' : 'Sign Up'}
        </button>
        
        <div className="text-center mt-4">
          <button
            onClick={() => setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn')}
            className="text-blue-600 hover:underline font-medium"
          >
            {authMode === 'signIn' ? 'Switch to Sign Up' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
