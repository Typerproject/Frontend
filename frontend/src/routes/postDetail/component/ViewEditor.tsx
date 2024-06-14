// import React from 'react'
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";
import { ChartBLock } from "../../editor/component/blockTools/chart/ChartBlock";

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
    },
  });

  return <div id="viewEditor"></div>;
}
