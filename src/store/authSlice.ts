import { createSlice, PayloadAction, createAsyncThunk, Action, SerializedError } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for checking user session
 const checkUserSession = createAsyncThunk('auth/checkUserSession', async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
});

// Async thunk for signing in
 const signIn = createAsyncThunk<any, { email: string; password: string }, { rejectValue: string }>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Email not confirmed') {
        return rejectWithValue('Please confirm your email before logging in.');
      }
      return rejectWithValue(error.message);
    }
    return data.user;
  }
);

// Async thunk for signing up
 const signUp = createAsyncThunk<any, { email: string; password: string }, { rejectValue: string }>(
  'auth/signUp',
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return rejectWithValue(error.message);
    }
    return data.user;
  }
);

// Async thunk for signing out
 const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Type guard for handling errors in rejected actions
function isRejectedWithError(action: Action): action is Action & { error: SerializedError } {
  return action.type.endsWith('/rejected') && 'error' in action;
}

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
      .addCase(signIn.fulfilled, (state, action: PayloadAction<any | null>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<any | null>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejectedWithError,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        }
      );
  },
});

export default authSlice.reducer;
export { checkUserSession, signIn, signUp, signOut };
