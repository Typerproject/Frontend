// import React from 'react'
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";
import { ChartBLock } from "../../editor/component/blockTools/chart/ChartBlock";
import { ReportBlock } from "../../editor/component/blockTools/Report/ReportBlock";
import { FinanceBlock } from "../../editor/component/blockTools/finance/FinanceBlock";
import { DisclosureBlock } from "../../editor/component/blockTools/disclosure/DisclosureBlock";
import { ImageBlock } from "../../editor/component/blockTools/image/ImageBlock";

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
        image: ImageBlock,
        news: NewsBlock,
        charts: ChartBLock,
        Report: ReportBlock,
        finance: FinanceBlock,
        disclosure: DisclosureBlock,
      },
      minHeight: 10
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
