// postDetail 관련 api..
import BaseApi from "./axiosInstance";
import { OutputData } from "@editorjs/editorjs";

// 요청에 쓰일 인터페이스 정의 부분
export interface IPostDetail {
  id: string;
  title: string;
  content: OutputData;
  public: boolean;
  writer: IPostWriter;
  writedAt: Date;
}
export interface IPostWriter {
  writerId: string;
  name: string;
  img: string;
}

export interface IPostBody {
  title: string | null;
  content: OutputData;
  public: boolean;
}

export interface IpostScrap {
  msg: string;
  postId: string;
  userId: string;
}

export default class postAPI extends BaseApi {
  async getPost(_id: string) {
    const resp = await this.fetcher.get("/", {
      params: { postId: _id },
    });
    return resp.data;
  }

  async addPost(body: IPostBody) {
    const resp = await this.fetcher.post("/", body);
    return resp.data;
  }

  async scrapPost(postId: string) {
    const resp = await this.fetcher.patch("/scrap", {
      postId: postId,
    });

    return resp.data;
  }

  async deleteScrapPost(postId: string) {
    const resp = await this.fetcher.delete(`/scrap/${postId}`);

    return resp.data;
  }

  async getScrapStatus(postId: string) {
    const resp = await this.fetcher.get('/scrap/status', {
      params: { postId: postId },
    }); 
    return resp.data;
  }
}
