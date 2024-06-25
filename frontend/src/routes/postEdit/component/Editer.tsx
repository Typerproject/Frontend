import EditorJS, {
  OutputData,
  type ToolConstructable,
} from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";
import { ChartBLock } from "../../editor/component/blockTools/chart/ChartBlock";
import { ReportBlock } from "../../editor/component/blockTools/Report/ReportBlock";
import { FinanceBlock } from "../../editor/component/blockTools/finance/FinanceBlock";
import { DisclosureBlock } from "../../editor/component/blockTools/disclosure/DisclosureBlock";
import { ImageBlock } from "../../editor/component/blockTools/image/ImageBlock";

type props = {
  content: OutputData;
  setContent: React.Dispatch<React.SetStateAction<OutputData | undefined>>;
};

export default function Editer({ content, setContent }: props) {
  const editorInstance = useRef<EditorJS | null>(null);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editPost",
      data: content,
      onReady: () => {
        editorInstance.current = editor;
      },
      onChange: async () => {
        setContent(await editor.save());
      },
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
        news: NewsBlock,
        charts: ChartBLock,
        Report: ReportBlock,
        finance: FinanceBlock,
        disclosure: DisclosureBlock,
      },
      autofocus: true,
      minHeight: 400,
    });

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
      editorInstance?.current?.destroy();
      editorInstance.current = null;
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
    if (editorInstance.current) {
      editorInstance.current.blocks.insert("image", {
        url: imageDataUrl,
      });
    }
  };

  useEffect(() => {
    if (editorInstance.current === null) {
      initEditor();
    }

    return () => {
      editorInstance?.current?.destroy();
      editorInstance.current = null;
    };
  }, []);
  return (
    <div id="editPost" className="w-[90%] mt-2 mb-5 overflow-y-auto"></div>
  );
}
