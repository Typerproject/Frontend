// import React from 'react'
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";
import { ChartBLock } from "../../editor/component/blockTools/chart/ChartBlock";
import { ReportBlock } from "../../editor/component/blockTools/Report/ReportBlock";
import { FinanceBlock } from "../../editor/component/blockTools/finance/FinanceBlock";

type props = {
  outPutData: OutputData;
};

export default function ViewEditor({ outPutData }: props) {
  const viewEditorInstance = useRef<EditorJS | null>(null);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "viewEditor",
      readOnly: true,
      data: outPutData,
      onReady: () => {
        viewEditorInstance.current = editor;
      },
      tools: {
        header: Header,
        news: NewsBlock,
        charts: ChartBLock,
        report: ReportBlock,
        finance: FinanceBlock,
      },
    });
  };

  useEffect(() => {
    if (viewEditorInstance.current === null) {
      initEditor();
    }

    return () => {
      viewEditorInstance?.current?.destroy();
      viewEditorInstance.current = null;
    };
  }, []);

  return <div id="viewEditor"></div>;
}
