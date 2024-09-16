import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../axios';

// Thunk for fetching user data using token
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axiosClient.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle', // for tracking API request state
    isAuthenticated: false, // Added to track if the user is authenticated
    error: null,
  },
  reducers: {
    login: (state, action) => {
      localStorage.setItem('accessToken', action.payload.token);
      state.isAuthenticated = false; // Initially false, updated after user data is fetched
      state.status = 'loading'; // Set loading state during login
    },
    logout: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('accessToken');
      if (action.payload?.navigation){
        action.payload.navigation("/login")
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true; // Set true after successful login
        state.status = 'succeeded';
      })
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false; // Reset to false if user data fetch fails
      });
  }
});

// Action creators
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
