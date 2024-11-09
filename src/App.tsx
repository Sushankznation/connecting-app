// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkUserSession } from './store/authSlice';
import Auth from './Auth';
import NewsFeed from './NewsFeed';
import CreatePostForm from './CreatePostForm';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
// import UserList from './UserList';

const client = new ApolloClient({
  uri: import.meta.env.VITE_SUPABASE_URL + '/graphql/v1', // Replace with your Supabase GraphQL endpoint
  headers: {
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY, // Use your Supabase anon/public API key
  },
  cache: new InMemoryCache(),
});

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
    </ApolloProvider>
  );
};

export default App;
