import axios from "axios";

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
  }
}
