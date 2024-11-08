// src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${import.meta.env.VITE_SUPABASE_URL}/graphql/v1`,
    headers: {
      apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
