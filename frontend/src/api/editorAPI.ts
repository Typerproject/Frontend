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

  async getCodeList() {
    const resp = await this.fetcher.get("/stock/code");

    console.log("주식 종목 리스트", resp.data.codeList);

    return resp.data;
  }

  async getNewsData(newsUrl: string) {
    const resp = await this.fetcher.post("/news", {
      url: newsUrl,
    });

    return resp.data;
  }

  async getCorpCode(name: string, page: number) {
    const resp = await this.fetcher.get("/disclosure/corpCode", {
      params: {
        name: name,
        page: page,
      },
    });

    return resp.data;
  }

  async getReportList(
    corpCode: string,
    bgn: string,
    end: string,
    page: number
  ) {
    const resp = await this.fetcher.get("/disclosure/list", {
      params: {
        corpCode: corpCode,
        bgn: bgn,
        end: end,
        page: page,
      },
    });

    return resp.data;
  }

  async getReport(reportNum: string) {
    const res = await this.fetcher.get(`/disclosure/report/${reportNum}`);

    return res.data;
  }
}
