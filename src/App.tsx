// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import client from './apolloClient';
import { checkUserSession } from './store/authSlice';
import Auth from './Auth';
import NewsFeed from './NewsFeed';

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
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/news-feed"
            element={
              <ProtectedRoute>
                <NewsFeed />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/news-feed" : "/auth"} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
