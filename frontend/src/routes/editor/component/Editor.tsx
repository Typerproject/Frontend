import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import "../../../index.css";
import Header from "@editorjs/header";
import { type ToolConstructable, OutputData } from "@editorjs/editorjs";
import { ChartBLock } from "./blockTools/chart/ChartBlock";
import { NewsBlock } from "./blockTools/news/NewsBlock";
import { FinanceBlock } from "./blockTools/finance/FinanceBlock";
import { ReportBlock } from "./blockTools/Report/ReportBlock";
type Props = {
  setContent: (value: OutputData) => void;
};
export default function Editor({ setContent }: Props) {
  const ejInstance = useRef<EditorJS | null>(null);
  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "내용을 입력해주세요.",
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        setContent(await editor.save());
      },
      minHeight: 400,
      tools: {
        header: {
          class: Header as unknown as ToolConstructable,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 3,
          },
        },
        charts: ChartBLock,
        news: NewsBlock,
        Report: ReportBlock,
        finance: FinanceBlock
      },
      autofocus: true,
    });
  };
  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }
    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);
  return (
    <div
      id="editorjs"
      className="w-[90%] mt-2 mb-5 overflow-y-auto"
    ></div>
  );
}