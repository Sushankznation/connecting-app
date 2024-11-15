// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './Auth/hooks';
import { checkUserSession } from './Auth/authSlice';
import Auth from './Auth/Auth';
import NewsFeed from './components/NewsFeed';
import CreatePostForm from './components/CreatePostForm';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
      <Router>
        <div className="app-container min-h-screen bg-gray-100">
          {user && <Header />}
          <div className="container mx-auto p-4">
            <Routes>
              {/* Authentication Route */}
              <Route path="/auth" element={<Auth />} />
              {/* <Route path="/user-list" element={<UserList />} /> */}
              {/* Protected Route for NewsFeed */}
              <Route
                path="/news-feed"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <div>
                        <h1 className="text-2xl font-bold mb-4">News Feed</h1>
                        <NewsFeed userId={user?.id} />
                      </div>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Protected Route for Creating Post */}
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <div>
                       <CreatePostForm userId={user?.id} />
                      </div>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              {/* Default Route based on Authentication Status */}
              <Route path="*" element={<Navigate to={user ? "/news-feed" : "/auth"} />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
};

export default App;
