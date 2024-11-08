import React, { useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkUserSession } from './store/authSlice';
import Auth from './Auth';

const client = new ApolloClient({
  uri: `${import.meta.env.VITE_SUPABASE_URL}/graphql/v1`,
  headers: {
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  },
  cache: new InMemoryCache(),
});

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <ApolloProvider client={client}>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          {/* Your main app components go here */}
        </div>
      ) : (
        <Auth />
      )}
    </ApolloProvider>
  );
}

export default App;
