import { useEffect, useState } from "react";
import Editor from "./component/Editor";
import Timer from "./component/Timer";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import { OutputData } from "@editorjs/editorjs";
import postAPI from "../../api/postDetailAPI";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);
export default function EditorPage() {
  const [isPublic, setPublic] = useState(true);
  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<OutputData>();
  const currentUser = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const changeVisibility = () => {
    setPublic(!isPublic);
  };

  useEffect(() => {
    if (!currentUser || currentUser._id === null) {
      alert("로그인을 해주세요!");
      navigate("/");
      return;
    }
  }, []);

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
      <div className="h-dvh">
        <nav className="bg-black h-4" />
        <div className="flex flex-col items-center">
          <input
            type="text"
            className="block w-11/12 p-4 text-4xl outline-none"
            placeholder="제목을 입력해주세요"
            maxLength={25}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Timer />
          <Editor setContent={setContent} />
        </div>
        <footer className="bg-black h-14 fixed bottom-0 right-0 left-0 flex items-center justify-between px-16 z-[100]">
          <p
            className="text-white text-xl cursor-pointer hover:opacity-80"
            onClick={() => navigate(-1)}
          >
            나가기
          </p>
          <div className="flex items-center gap-4">
            {isPublic ? (
              <IoMdUnlock
                className="hover:opacity-80 cursor-pointer"
                color={"white"}
                size={30}
                onClick={changeVisibility}
                title="공개"
              />
            ) : (
              <IoMdLock
                className="hover:opacity-80 cursor-pointer"
                color={"white"}
                size={30}
                onClick={changeVisibility}
                title="비공개"
              />
            )}
            <p
              className="text-white text-xl cursor-pointer hover:opacity-80"
              onClick={publish}
            >
              출간
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
