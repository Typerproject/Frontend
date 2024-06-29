import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  _id: string | null;
  nickname: string | null;
  email: string | null;
  comment: string | null;
  profile: string | null;
}

type userInfo = {
  user: UserState;
};

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
    setUser: (state, action: PayloadAction<userInfo>) => {
      //PayloadAction은 action 객체의 payload에 대해 redux toolkit에서 제공하는 type
      //로그인 했을 때 로직
      state._id = action.payload.user._id;
      state.nickname = action.payload.user.nickname;
      state.email = action.payload.user.email;
      state.comment = action.payload.user.comment;
      state.profile = action.payload.user.profile;
    },
    logoutUser: (state) => {
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
