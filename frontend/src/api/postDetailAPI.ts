// postDetail 관련 api..
import BaseApi from "./axiosInstance";
import { OutputData } from "@editorjs/editorjs";

// 요청에 쓰일 인터페이스 정의 부분
export interface IPostDetail {
  _id: string;
  writer: string;
  // updated: Date;
  // 글 내용 추가 필요
}

export interface IAddPostBody {
  title: string | null;
  content: OutputData;
  public: boolean;
}

export default class postAPI extends BaseApi {
  async getPost(_id: string) {
    const resp = await this.fetcher.post("/", {
      params: { postId: _id },
    });
    return resp.data;
  }

  async addPost(body: IAddPostBody) {
    const resp = await this.fetcher.post("/", body);
    return resp.data;
  }
}
