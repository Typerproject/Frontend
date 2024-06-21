import WriterInfo from "./WriterInfo";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useEffect, useState } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, {
  IPostWriter,
  IPostDetail,
  IpostScrap,
} from "../../../api/postDetailAPI";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import CommentList from "./CommentList";
import { FaRegComment } from "react-icons/fa";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);
export default function PostContent() {
  const [title, setTitle] = useState<string>("title");
  const [writer, setWriter] = useState<IPostWriter>();
  const [outputData, setOutputData] = useState<OutputData>();
  const [writedAt, setWritedAt] = useState<string>();
  const [scrap, setScrap] = useState<boolean>(false);
  const [vaildComment, setValidComment] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>() as { id: string };
  useEffect(() => {
    service.getPost(id).then((res: IPostDetail) => {
      console.log(res);
      setTitle(res.title);
      setWriter(res.writer);
      setOutputData(res.content);
      setScrap(res.isScrapped);

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

  async function handleLike() {
    // setScrap((prev) => !prev);
    // 스크랩하는 로직
    if (scrap) {
      service
        .deleteScrapPost(id)
        .then((res: IpostScrap) => {
          console.log(res);
          setScrap(false);
        })
        .catch((e) => {
          console.log(e);
          alert("스크랩 삭제에 실패하였습니다.");
        });
    } else {
      service
        .scrapPost(id)
        .then((res: IpostScrap) => {
          console.log(res);
          setScrap(true);
        })
        .catch((e) => {
          console.log(e);
          alert("스크랩에 실패하였습니다.");
        });
    }
  }

  return (
    <>
      <div className="w-full h-full min-h-70 rounded-[10px] py-[2rem] mb-[2rem]">
        {/* 글 제목, 날짜, 글쓴이 기본 정보 */}
        <h1 className="text-3xl	font-bold">{title}</h1>
        <p className="text-gray-400 my-[10px]">{writedAt}</p>
        {writer && <WriterInfo writer={writer} />}

        {/* divider */}
        <div className="h-[0.5px] my-[0.75rem] w-full bg-current"></div>

        {/* 글 내용 */}
        {outputData && <ViewEditor outPutData={outputData} />}

        <hr className="my-[2rem]" />
        <div className="flex flex-row-reverse items-center gap-[1rem]">
          <p>123</p>
          <div
            onClick={() => handleLike()}
            className="cursor-pointer ml-[1rem]"
          >
            {scrap ? <IoBookmark size={20} /> : <IoBookmarkOutline size={20} />}
          </div>
          {/* 코멘트 수 */}
          <p>12</p>
          <div
            className="cursor-pointer"
            onClick={() => setValidComment((prev) => !prev)}
          >
            <FaRegComment />
          </div>
        </div>
      </div>

      {vaildComment && <CommentList />}
    </>
  );
}
