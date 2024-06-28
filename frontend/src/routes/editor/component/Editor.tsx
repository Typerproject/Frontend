import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { ChartBLock } from "./blockTools/chart/ChartBlock";
import { NewsBlock } from "./blockTools/news/NewsBlock";
import { FinanceBlock } from "./blockTools/finance/FinanceBlock";
import { ReportBlock } from "./blockTools/Report/ReportBlock";
import { type ToolConstructable, OutputData } from "@editorjs/editorjs";
import { DisclosureBlock } from "./blockTools/disclosure/DisclosureBlock";
import { ImageBlock } from "./blockTools/image/ImageBlock";
import { useNavigate } from "react-router-dom";

type Props = {
  setContent: (value: OutputData) => void;
};

export default function Editor({ setContent }: Props) {
  const ejInstance = useRef<EditorJS | null>(null);
  const navigate = new useNavigate();

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
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 1,
          },
        },

        image: ImageBlock,
        charts: ChartBLock,
        news: NewsBlock,
        Report: ReportBlock,
        finance: FinanceBlock,
        disclosure: DisclosureBlock,
      },
      autofocus: true,
    });

    const editorElement = document.getElementById("editorjs");
    if (editorElement) {
      editorElement.addEventListener("paste", handlePaste);
    }

    // document.addEventListener('paste', handlePaste);

    return () => {
      // document.removeEventListener('paste', handlePaste);
      if (editorElement) {
        editorElement.removeEventListener("paste", handlePaste);
      }
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    if (event.clipboardData) {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              insertImageBlock(url);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  };

  const insertImageBlock = (imageDataUrl: string) => {
    if (ejInstance.current) {
      ejInstance.current.blocks.insert("image", {
        url: imageDataUrl,
      });
    }
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      if (window.innerWidth <= 768) {
        alert("에디터는 모바일에서 사용할 수 없습니다. PC를 사용해주세요");
        navigate(-1);
        return;
      }

      initEditor();
    }
  }, []);

  return (
    <div id="editorjs" className="w-[90%] mt-2 mb-5 overflow-y-auto"></div>
  );
}
