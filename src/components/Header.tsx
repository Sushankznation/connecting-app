// src/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Auth/hooks';
import { signOut } from '../Auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-lg font-bold">
        <Link to="/news-feed" className="hover:underline">My Social App</Link>
      </h1>
      {user && (
        <nav className="space-x-4">
          <Link to="/news-feed" className="hover:underline">News Feed</Link>
          <Link to="/create-post" className="hover:underline">Create Post</Link>
          <button onClick={handleSignOut} className="hover:underline">Sign Out</button>
        </nav>
      )}
    </header>
  );
};

export default Header;
