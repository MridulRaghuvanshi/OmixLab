import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")).replace(/^"|"$/g, '') : null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      // Clean and store token
      const cleanToken = typeof value.payload === 'string' 
        ? value.payload.replace(/^"|"$/g, '')
        : typeof value.payload === 'object' && value.payload !== null
          ? JSON.stringify(value.payload).replace(/^"|"$/g, '')
          : null;
          
      state.token = cleanToken;
      localStorage.setItem("token", cleanToken); // Store without JSON.stringify
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;