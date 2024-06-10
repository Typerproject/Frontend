// postDetail 관련 api..
import BaseApi from "./axiosInstance";

// 요청에 쓰일 인터페이스 정의 부분
export interface IPostDetail {
    _id: string;
    writer: string;
    // updated: Date;
    // 글 내용 추가 필요
}

export default class postDetailAPI extends BaseApi {
    async getPostInfo(_id:string) {
        const resp = await this.fetcher.post("/postInfo", {
            id: _id,
        });
        return resp.data;
    }
}