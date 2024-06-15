import { useRef, useState } from "react";
import Editor from "./component/Editor";
import Timer from "./component/Timer";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import { OutputData } from "@editorjs/editorjs";
import postAPI from "../../api/postDetailAPI";
import { useNavigate } from "react-router-dom";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

export default function EditorPage() {
  const [isPublic, setPublic] = useState(true);
  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<OutputData>();
  const holder = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const changeVisibility = () => {
    setPublic(!isPublic);
  };

  const publish = async () => {
    if (!content?.blocks) {
      alert("내용이 없습니다. 내용을 작성해주세요");
      return;
    }
    if (title === null) {
      alert("제목이 없습니다. 제목을 작성해주세요");
      return;
    }

    const result = await service.addPost({
      title: title,
      content: content,
      public: isPublic,
    });

    navigate(`/post/${result._id}`);
  };

  return (
    <>
      <nav className="fixed top-0 bg-black h-4 w-full" />
      <div className="flex flex-col items-center overflow-y-scroll h-screen">
        <input
          type="text"
          className="block w-[95%] p-4 text-4xl"
          placeholder="제목을 입력해주세요"
          maxLength={25}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Timer />

        <div
          className="w-[98%] mt-2 mb-5 min-h-dv min-h-[80%] h-fit"
          ref={holder}
        >
          <Editor setContent={setContent} holder={holder} />
        </div>
      </div>
      <footer className="fixed bg-black h-14 bottom-[0px] flex items-center justify-between	px-16 w-full">
        <p className="text-white text-xl" onClick={() => navigate("/my")}>
          나가기
        </p>

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
    </>
  );
}
