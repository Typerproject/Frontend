import WriterInfo from "./WriterInfo";
import { FaHeart } from "react-icons/fa6"; // 채워진 하트
import { FaRegHeart } from "react-icons/fa6"; // 빈 하트
import { useEffect, useState } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, { IPostWriter, IPostDetail } from "../../../api/postDetailAPI";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);
export default function PostContent() {
  const [title, setTitle] = useState<string>("title");
  const [writer, setWriter] = useState<IPostWriter>();
  const [outputData, setOutputData] = useState<OutputData>();
  const [writedAt, setWritedAt] = useState<string>();

  const { id } = useParams<{ id: string }>() as { id: string };
  useEffect(() => {
    service.getPost(id).then((res: IPostDetail) => {
      console.log(res);
      setTitle(res.title);
      setWriter(res.writer);
      setOutputData(res.content);

      const date = new Date(res.writedAt);
      const formattedDate = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24시간 형식
      });
      setWritedAt(`${formattedDate} ${formattedTime}`);
    });
  }, [id]);

  const [validHeart, setValidHeart] = useState(false);

  function handleLike() {
    setValidHeart((prev) => !prev);
    // 좋아요 보내는 로직
  }

  return (
    <div className="w-full h-full min-h-70 rounded-[10px] shadow-[0_0_8px_5px] shadow-gray-200 p-[2rem]">
      {/* 글 제목, 날짜, 글쓴이 기본 정보 */}
      <h1 className="text-3xl	font-bold">{title}</h1>
      <p className="text-gray-400 my-[10px]">{writedAt}</p>
      {writer && <WriterInfo writer={writer} />}

      {/* divider */}
      <div className="h-[0.5px] my-[0.75rem] w-full bg-current"></div>

      {/* 글 내용 */}
      {outputData && <ViewEditor outPutData={outputData} />}

      <div className="flex flex-row-reverse items-center gap-[1rem]">
        <p>123</p>
        <div onClick={() => handleLike()} className="cursor-pointer">
          {validHeart ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </div>
      </div>
    </div>
  );
}
