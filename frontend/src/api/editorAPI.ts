import BaseApi from "./axiosInstance";

interface stockParams {
  marketCode: string;
  stockCode: string;
  startDate: string;
  endDate: string;
  period: string;
  prc: string;
}

export default class editorAPI extends BaseApi {
  async getStockData(params: stockParams) {
    const resp = await this.fetcher.get("/stock", {
      params: {
        marketCode: params.marketCode,
        stockCode: params.stockCode,
        startDate: params.startDate,
        endDate: params.endDate,
        period: params.period,
        prc: params.prc,
      },
    });

    return resp.data;
  }

  async getNewsData(newsUrl: string) {
    const resp = await this.fetcher.post("/news", {
      url: newsUrl,
    });

    return resp.data;
  }
}
