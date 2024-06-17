import { createSlice } from "@reduxjs/toolkit";

interface LoginModalState {
  isLoginModalOpen: boolean;
}

const initialState: LoginModalState = {
  isLoginModalOpen: false,
};

const loginModalSlice = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    openLoginModal(state) {
      state.isLoginModalOpen = true;
    },
    closeLoginModal(state) {
      state.isLoginModalOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal } = loginModalSlice.actions;
export default loginModalSlice.reducer;
