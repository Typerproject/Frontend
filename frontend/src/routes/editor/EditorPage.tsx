import { useState } from "react";
import Editor from "./component/Editor";
import Timer from "./component/Timer";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import { OutputData } from "@editorjs/editorjs";
import postAPI from "../../api/postDetailAPI";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

export default function EditorPage() {
  const [isPublic, setPublic] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<OutputData>();

  const changeVisibility = () => {
    setPublic(!isPublic);
  };

  const publish = () => {
    if (!content?.blocks) {
      console.log("데이터가 존재하지 않음");
      return;
    }

    service.addPost({
      title: title,
      content: content,
      public: isPublic,
    });
  };

  return (
    <>
      <div className="h-dvh">
        <nav className="bg-black h-4" />
        <div className="flex flex-col items-center">
          <input
            type="text"
            className="block w-11/12 p-4 text-4xl mb-4"
            placeholder="제목을 입력해주세요"
            maxLength={25}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Timer />

          <Editor setContent={setContent} />
        </div>
        <footer className="bg-black h-14 sticky top-[100vh] flex items-center justify-between	px-16">
          <p className="text-white text-xl">나가기</p>

          <div className="flex items-center w-[10%] justify-between	">
            {isPublic ? (
              <IoMdUnlock
                color={"white"}
                size={30}
                onClick={changeVisibility}
                title="공개"
              />
            ) : (
              <IoMdLock
                color={"white"}
                size={30}
                onClick={changeVisibility}
                title="비공개"
              />
            )}
            <p className="text-white text-xl" onClick={publish}>
              출간
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
