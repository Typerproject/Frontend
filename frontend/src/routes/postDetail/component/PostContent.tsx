import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useEffect, useState } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, { IpostScrap } from "../../../api/postDetailAPI";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import CommentList from "./CommentList";
import { FaRegComment } from "react-icons/fa";
import commentAPI from "../../../api/commentAPI";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

type Props = {
  scrap: boolean;
  outputData: OutputData;
  setScrap: React.Dispatch<React.SetStateAction<boolean>>;
  scrapingCount: number;
};

const commentService = new commentAPI(import.meta.env.VITE_BASE_URI);

export default function PostContent({
  scrap,
  setScrap,
  outputData,
  scrapingCount,
}: Props) {
  const [vaildComment, setValidComment] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>() as { id: string };
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetcthComments = async () => {
      const resp = await commentService.getCommentList(id);
      setComments(resp);
    };
    fetcthComments();
  }, []);

  async function handleLike() {
    if (scrap) {
      service
        .deleteScrapPost(id)
        .then((res: IpostScrap) => {
          console.log(res);
          alert("스크랩 삭제 성공");
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
          alert("스크랩 성공");
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
          <p>
            {comments.reduce((acc, cur) => {
              return acc + 1 + cur.replies.length;
            }, 0)}
          </p>
          <div
            className="cursor-pointer"
            onClick={() => setValidComment((prev) => !prev)}
          >
            <FaRegComment />
          </div>
          <p className="mr-[10px]">{scrapingCount}</p>
          <div onClick={() => handleLike()} className="cursor-pointer">
            {scrap ? <IoBookmark size={20} /> : <IoBookmarkOutline size={20} />}
          </div>
        </div>
      </div>

      {vaildComment && <CommentList comments={comments} />}
    </>
  );
}
