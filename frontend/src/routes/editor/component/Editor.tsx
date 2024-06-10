import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import "./Editor.css";

export default function Editor() {
  const ejInstance = useRef<EditorJS | null>(null);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "내용을 입력해주세요.",
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        const content = await editor.saver.save();
        console.log(content);
      },
      minHeight: 400,
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
      className="w-11/12 mt-2 border-solid border-2 rounded-2xl shadow-md mb-5 overflow-y-auto max-h-[62vh]"
    ></div>
  );
}
