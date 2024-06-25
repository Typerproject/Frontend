import BaseApi from "./axiosInstance";

interface ICommentReq {
  text: string;
  postId: string;
}

interface IReplyReq extends ICommentReq {
  parentCommentId: string;
}

export default class commentAPI extends BaseApi {
  async postComment(req: ICommentReq) {
    const resp = await this.fetcher.post(`/comment`, {
      text: req.text,
      postId: req.postId,
    });

    return resp;
  }

  async postReply(req: IReplyReq) {
    const resp = await this.fetcher.post(`/comment/reply`, {
      text: req.text,
      postId: req.postId,
      parentCommentId: req.parentCommentId,
    });

    return resp;
  }

  async deleteComment(commentId: string) {
    const resp = await this.fetcher.delete(`/comment/${commentId}`);
    return resp;
  }

  async getCommentList(postId: string) {
    const resp = await this.fetcher.get(`/comment/${postId}`);
    return resp.data;
  }
}
