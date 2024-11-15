import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './Auth/store.ts';
import client from './queries/apolloClient.ts';
import { ApolloProvider } from '@apollo/client';
createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
     <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
    </ApolloProvider>
  </StrictMode>,
)
