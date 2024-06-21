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
  isScrapped: boolean;
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

// 메인 페이지를 위한 Post List interface
// 작성자 정보를 담는 인터페이스
interface IWriter {
  id: string;
  name: string;
  img: string;
}

// 미리보기 정보를 담는 인터페이스
interface IPreview {
  text: string;
  img: string;
  _id: string;
}

// 포스트 정보를 담는 인터페이스
export interface IPost {
  title: string;
  _id: string;
  preview: IPreview;
  createdAt: string;
  public: boolean;
  writer: IWriter;
  scrapingCount: number;
  isScrapped: boolean;
}

// 메인 화면용 포스트 리스트를 담는 인터페이스
export interface IPostListForMain {
  posts: IPost[];
}

export default class postAPI extends BaseApi {
  async getPost(_id: string) {
    const resp = await this.fetcher.get(`/${_id}`);
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

  async getScrapList() {
    const resp = await this.fetcher.get("/scrap/list");

    return resp.data;
  }

  // 메인 페이지
  async getPostListForMain(page = 1, type = "") {
    try {
      const queryParams = `?page=${page}${type !== "" ? `&type=${type}` : ""}`;
      const resp = await this.fetcher.get(`/list${queryParams}`);

      console.log("메인 페이지를 위한 데이터 GET: ", resp);

      if (!resp) {
        console.log("메인 페이지 GET /post/list error: 데이터 없음");
        return { posts: [] };
      }

      const data: IPost[] = await resp.data;

      console.log("나와라 제이슨 형식!", data);

      // const previewForMain = data.map((elem: IPost) => ({
      //   preview: elem.preview,
      // }));

      // console.log("나와라 프리뷰~", previewForMain);

      return { posts: data };

      // return posts;
    } catch (error) {
      console.error("Error fetching post list:", error);
      throw error; // 예외 처리를 원하는 방식으로 수정 가능
    }
  }
}
