import React, { useRef, useEffect, RefObject } from "react";
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
  holder: RefObject<HTMLDivElement>;
};

export default function Editor({ setContent, holder }: Props) {
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
        report: ReportBlock,
        finance: FinanceBlock

      },
      autofocus: true,
    });

    if (holder.current) {
      holder.current.addEventListener("click", () => {
        editor.focus();
      });
    }
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
      className="border-solid border-x-2 border-slate-300 min-h-[100%]"
    ></div>
  );
}
