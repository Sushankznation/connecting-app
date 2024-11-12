// src/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Auth/hooks';
import { signOut } from '../Auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-lg font-bold">
        <Link to="/news-feed" className="hover:underline">My Social App</Link>
      </h1>
      {user && (
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}
      <nav
        className={`${
          menuOpen ? 'block' : 'hidden'
        } md:flex space-x-4 md:space-x-8 absolute md:relative top-14 md:top-0 left-0 w-full md:w-auto p-4 md:p-0 bg-blue-600 md:bg-transparent`}
      >
        <Link to="/news-feed" className="block py-2 hover:underline">
          News Feed
        </Link>
        <Link to="/create-post" className="block py-2 hover:underline">
          Create Post
        </Link>
        <button onClick={handleSignOut} className="block py-2 hover:underline">
          Sign Out
        </button>
      </nav>
    </header>
  );
};

export default Header;
