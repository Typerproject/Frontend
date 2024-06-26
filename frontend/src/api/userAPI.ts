// user 관련된 api 모아주세용
import BaseApi from "./axiosInstance";
import { Pre } from "../routes/my/MyPage";

interface Preview {
  title: string;
  _id: string;
  preview: Pre;
  createdAt: string;
  public: boolean;
  scrapingCount: number;
  isScrapped: boolean;
}

//writedPost를 api 분리
export interface IWritedPost {
  posts: Preview[];
}

export interface IUserInfo {
  nickname: string;
  comment: string;
  profile: string;
}

// IFollowerInfo 배열 안의 유저 데이터를 표현한 거임
export interface IDifferentUser {
  _id: string;
  nickname: string;
  profile: string;
}

export interface IFollowerInfo {
  followingCount: number;
  followerCount: number;
  followingUsers: IDifferentUser[];
  followerUsers: IDifferentUser[];
}

export interface FollowResponse {
  message: string;
  response: boolean;
}

export default class userAPI extends BaseApi {
  // 마이페이지에 유저 정보를 띄우기 위한 api
  async getUserInfo(_id: string): Promise<IUserInfo> {
    try {
      const resp = await this.fetcher.get(`/user/info/${_id}`);

      return resp.data;
    } catch (err) {
      console.error("유저 정보 api 에러: ", err);
      throw err; // 에러를 호출한 쪽으로 던짐
    }
  }

  //마이페이지 유저가 작성한 포스트를 띄우기 위한 api
  async getWritedPost(
    _id: string | undefined,
    page: number
  ): Promise<IWritedPost> {
    try {
      const queryParams = `?page=${page}`;
      const resp = await this.fetcher.get(
        `/user/info/post/${_id}${queryParams}`
      );
      const data: Preview[] = await resp.data;

      return { posts: data };
    } catch (err) {
      console.error("유저 포스트 api error");
      throw err;
    }
  }

  // 닉네임 변경 api
  async modifyUserNickname(nickname: string) {
    try {
      const result = await this.fetcher.put(`/user/nickname`, {
        nickname: nickname,
      });

      return result.data;
    } catch (error) {
      console.error("닉네임 변경 api 에러: ", error);
      throw error;
    }
  }

  // 유저의 팔로워 수와 팔로우 한 사람의 수 + 유저 리스트까지
  async getFollowingAndFollowerData(_id: string): Promise<IFollowerInfo> {
    try {
      const resp = await this.fetcher.get(`/user/follower/${_id}`);
      return resp.data;
    } catch (err) {
      console.error("유저의 팔로워 정보 에러: ", err);
      throw err;
    }
  }

  // 유저 한 줄 소개 수정 api
  async updateUserComment(comment: string): Promise<any> {
    try {
      const result = await this.fetcher.put(`/user/comment`, {
        comment: comment,
      });

      return result.data; // { message: "팔로우 성공!", comment: "값" }
    } catch (error) {
      console.error("유저 한 줄 소개 수정 api 에러: ", error);
      throw error;
    }
  }

  // 내가 누군가를 팔로잉 하는 api
  async followingUser(_id: string): Promise<FollowResponse> {
    try {
      const result = await this.fetcher.post(`/user/following`, {
        _id: _id,
      });

      return result.data as FollowResponse; // { message: "팔로우 성공!", response: true }
    } catch (error) {
      console.error("내가 누군가를 팔로우 하는 api 에러: ", error);
      throw error;
    }
  }

  // 팔로잉 취소 api
  async deleteFollowingUser(_id: string): Promise<any> {
    try {
      const resp = await this.fetcher.delete(`/user/following/${_id}`);

      return resp.data; // { message: "언팔 성공!", response: true }
    } catch (error) {
      console.error("팔로잉 취소 api 에러: ", error);
    }
  }

  // 팔로워를 제거 api
  async deleteFollowerUser(_id: string): Promise<any> {
    try {
      const resp = await this.fetcher.delete(`/user/follower/${_id}`);

      return resp.data; // { message: "언팔 성공!", response: true  }
    } catch (error) {
      console.error("팔로워를 제거 api", error);
    }
  }

  // 로그아웃!
  async logout() {
    try {
      const resp = await this.fetcher.get(`/user/logout`);

      return resp.data;
    } catch (error) {
      console.error("로그아웃 하는 api: ", error);
    }
  }

  // 쿠키 테스트
  async checkCookie() {
    try {
      const resp = await this.fetcher.get(`/auth/cookie`);

      return resp.data;
    } catch (error) {
      console.error("쿠키 체크 에러: ", error);
    }
  }
}
