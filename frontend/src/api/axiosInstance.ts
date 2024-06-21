import axios, { AxiosError, AxiosResponse } from "axios";
import store from "../store";
import { openLoginModal } from "../store/reducers/auth";

export default class BaseApi {
  fetcher;
  constructor(url: string) {
    axios.defaults.withCredentials = true;
    this.fetcher = axios.create({
      baseURL: url,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // token 관련 interceptors 필요 시 코드 추가하면 될듯

    // 인터셉터 설정
    this.fetcher.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          // 401 에러인 경우 Redux 액션 디스패치
          store.dispatch(openLoginModal());
        }
        return Promise.reject(error);
      }
    );
  }
}
