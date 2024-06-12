import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string | null;
  nickname: string | null;
  email: string | null;
  comment: string | null;
  profile: string | null;
}

const initialState: UserState = {
  _id: null,
  nickname: null,
  email: null,
  comment: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log(state);
      console.log(action);
      //PayloadAction은 action 객체의 payload에 대해 redux toolkit에서 제공하는 type
      //로그인 했을 때 로직
      state._id = action.payload._id;
      state.nickname = action.payload.nickname;
      state.email = action.payload.email;
      state.comment = action.payload.comment;
      state.profile = action.payload.profile;
    },
    logoutUser: (state) => {
      console.log(state);
      //로그아웃
      state._id = null;
      state.nickname = null;
      state.email = null;
      state.comment = null;
      state.profile = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
