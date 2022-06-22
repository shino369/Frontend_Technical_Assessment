import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "models";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState:AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;