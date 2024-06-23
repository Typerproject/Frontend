import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import {  useState } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, {
  IpostScrap,
} from "../../../api/postDetailAPI";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import CommentList from "./CommentList";
import { FaRegComment } from "react-icons/fa";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

type Props = {
  scrap: boolean,
  outputData: OutputData,
  setScrap: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PostContent({scrap, setScrap, outputData} : Props) {
  const [vaildComment, setValidComment] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>() as { id: string };

  async function handleLike() {
    if (scrap) {
      service
        .deleteScrapPost(id)
        .then((res: IpostScrap) => {
          console.log(res);
          alert("스크랩 삭제 성공")
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
          alert("스크랩 성공")
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
      <div className="w-full h-full min-h-70 rounded-[10px] py-[4rem]">

        {/* 글 내용 */}
        {outputData && <ViewEditor outPutData={outputData} />}

        <hr className="mb-[2rem]" />
        <div className="flex flex-row-reverse items-center gap-[1rem]">
          {/* 코멘트 수 */}
          <p>12</p>
          <div
            className="cursor-pointer"
            onClick={() => setValidComment((prev) => !prev)}
          >
            <FaRegComment />
          </div>
          <p className="mr-[10px]">123</p>
          <div onClick={() => handleLike()} className="cursor-pointer">
            {scrap ? <IoBookmark size={20} /> : <IoBookmarkOutline size={20} />}
          </div>
        </div>
      </div>

      {vaildComment && <CommentList />}
    </>
  );
}
