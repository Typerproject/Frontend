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
  scrapingCount: number;
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
  nickname: string;
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
  commnetCount: number;
}

// 메인 화면용 포스트 리스트를 담는 인터페이스
export interface IPostListForMain {
  posts: IPost[];
}

// 메인 슬라이드
export interface IPostSlider {
  _id: string;
  title: string;
  preview: IPreview;
  userId: string;
  writer: IWriter;
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

  async getScrapList(page: number) {
    const resp = await this.fetcher.get("/scrap/list", {
      params: {
        page: page,
      },
    });

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

      console.log("메인 페이지 리스트", data);

      return { posts: data };
    } catch (error) {
      console.error("Error fetching post list:", error);
      throw error;
    }
  }

  async getPostListForSlide() {
    const resp = await this.fetcher.get("/random");

    const data: IPostSlider[] = resp.data.randomPosts;

    console.log("슬라이드 리스트 데이터", data);

    return data;
  }
}
