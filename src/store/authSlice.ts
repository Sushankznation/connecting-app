import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for checking if a user session exists
const checkUserSession = createAsyncThunk('auth/checkUserSession', async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
});

// Async thunk for signing in
const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);

// Updated async thunk for signing up, adding profile to `users` table
const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password, username, name }: { email: string; password: string; username: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      // Step 1: Sign up user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error('User ID not found after sign-up');

      // Step 2: Insert user profile in the custom `users` table
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: userId, username, email, name }]);
      if (profileError) throw profileError;

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for signing out
const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signOut();
  if (error) return rejectWithValue(error.message);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession.fulfilled, (state, action: PayloadAction<any | null>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
export { checkUserSession, signIn, signUp, signOut };
