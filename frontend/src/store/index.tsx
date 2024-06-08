import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

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

export const useAppDispatch:() => typeof store.dispatch=useDispatch;
// const dispatch = useAppDispatch(); 로 사용
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
// const userInfo = useAppSelector(state=>state.user); 로 사용하기
// export type RootState = ReturnType<typeof store.getState>; //useSelect 사용 시 state 받을 때 쓰는 타입
export default store;
