// import React from 'react'
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";
import { ChartBLock } from "../../editor/component/blockTools/chart/ChartBlock";
import { ReportBlock } from "../../editor/component/blockTools/Report/ReportBlock";
import { FinanceBlock } from "../../editor/component/blockTools/finance/FinanceBlock";


type props = {
  outPutData: OutputData;
};

export default function ViewEditor({ outPutData }: props) {
  new EditorJS({
    holder: "viewEditor",
    readOnly: true,
    data: outPutData,
    tools: {
      header: Header,
      news: NewsBlock,
      charts: ChartBLock,
      report: ReportBlock,
      finance: FinanceBlock,
    },
  });

  return <div id="viewEditor"></div>;
}
