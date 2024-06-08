import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    // middlewares.push(myMiddleware); //커스텀 미들웨어 적용 시
    return middlewares;
  },
});

export type RootState = ReturnType<typeof store.getState>; //useSelect 사용 시 state 받을 때 쓰는 타입

export default store;
