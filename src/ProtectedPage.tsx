// src/ProtectedPage.tsx
import React from 'react';
import { useAppDispatch } from './store/hooks';
import { signOut } from './store/authSlice';
import { useNavigate } from 'react-router-dom';

const ProtectedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOut()).then(() => {
      navigate('/auth');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to the Protected Page!</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
};

export default ProtectedPage;
