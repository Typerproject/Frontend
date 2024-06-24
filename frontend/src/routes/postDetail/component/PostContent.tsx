import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useState, useEffect } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, { IpostScrap } from "../../../api/postDetailAPI";
import { useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import CommentList from "./CommentList";
import { FaRegComment } from "react-icons/fa";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

type Props = {
  scrap: boolean;
  outputData: OutputData;
  setScrap: React.Dispatch<React.SetStateAction<boolean>>;
};

interface IprogressStyle {
  width: number;
  opacity: number;
}

export default function PostContent({ scrap, setScrap, outputData }: Props) {
  const [vaildComment, setValidComment] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>() as { id: string };

  const [progress, setProgress] = useState<IprogressStyle>(
    {} as IprogressStyle
  );

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

  const getElementPostion = () => {
    const mainPost = document.getElementById("mainPost");
    const progressBar = document.getElementById("progress-bar");
    const postEnd = document.getElementById("post-end");

    const scrollY = window.scrollY; // 스크롤 양

    const mainPostPosition =
      mainPost && Math.floor(scrollY + mainPost.getBoundingClientRect().top); // 절대위치, Math.floor로 정수로 변환

    const progressPostion =
      progressBar &&
      Math.floor(scrollY + progressBar.getBoundingClientRect().bottom);

    const postEndPosition =
      postEnd && Math.floor(scrollY + postEnd.getBoundingClientRect().top);

    // console.log("scrollY : ", scrollY);
    // console.log("progressPostion : ", progressPostion);
    // console.log("postEndPosition : ", postEndPosition);

    // window.innerHeight + scrollY가 mainBottomPosition아래로 내려가면 -> progress bar width는 100%이상이 되어야 한다...
    setProgress({
      width: postEndPosition
        ? (Number(window.innerHeight + scrollY) / Number(postEndPosition)) * 100
        : 0,
      opacity:
        mainPostPosition && progressPostion
          ? Number(progressPostion > mainPostPosition)
          : 0,
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", getElementPostion); // 스크롤시 getBannerPosition 발생

    return () => window.removeEventListener("scroll", getElementPostion); // 클린업, 페이지를 나가면 이벤트 삭제
  }, []);

  return (
    <>
      <div
        id="mainPost"
        className="w-full h-full min-h-70 rounded-[10px] py-[4rem]"
      >
        <div
          id="progress-bar"
          className="fixed top-0 left-0 bg-[#388BFF] z-[99] h-[80px] "
          style={{
            width: `${progress.width}%`,
            opacity: `${progress.opacity}`,
            transition: "width .2s ease-out",
          }}
        ></div>

        {/* 글 내용 */}
        {outputData && <ViewEditor outPutData={outputData} />}

        <hr id="post-end" className="mb-[2rem]" />
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
