import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../configs/customAxios';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logoutSuccess } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  try {
    // make login API call and get user data
    const response = await axios.post('login/', credentials);
    const user = null
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export default authSlice.reducer;