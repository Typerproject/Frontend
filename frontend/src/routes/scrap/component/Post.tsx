import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
import { IPostInfo } from "../ScrapPage";
import { useNavigate } from "react-router-dom";
import postAPI, { IpostScrap } from "../../../api/postDetailAPI";

type PostProps = {
  postInfo: IPostInfo;
};

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

export default function Post({ postInfo }: PostProps) {

  const navigate = useNavigate();

  const [scrap, setScrap] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [scrapCount, setScrapCount] = useState<number>(postInfo.scrapingCount)

  const handleMarkClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();

    if (scrap) {
      service
        .deleteScrapPost(postInfo._id)
        .then((res: IpostScrap) => {
          console.log(res);
          setScrap(false);          
          setScrapCount(prev => prev - 1);
        })
        .catch((e) => {
          console.log(e);
          alert("스크랩 삭제에 실패하였습니다.");
        });
    } else {
      service
        .scrapPost(postInfo._id)
        .then((res: IpostScrap) => {
          console.log(res);
          setScrap(true);
          setScrapCount(prev => prev + 1);
        })
        .catch((e) => {
          console.log(e);
          alert("스크랩에 실패하였습니다.");
        });
    }
  };

  useEffect(()=> {
    const date = new Date(postInfo.updatedAt);
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

    setUpdatedAt(`${formattedDate} ${formattedTime}`);
  },[]);

  return (
    <div
      onClick={() => navigate(`/post/${postInfo._id}`)}
    //   border-bottom: 1px solid #80808059;
      className="hover:bg-gray-100 hover:rounded-lg w-full p-[2rem] grid gap-[25px] grid-cols-8 cursor-pointer "
    >
      {/* 글쓴이, 제목, 내용, 스크랩 수, 댓글 수 */}
      <div className="flex justify-between col-span-6 w-full">
        <div className="relative w-full">
          {/* 글쓴이 정보 */}
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation();
              navigate(`/my/${postInfo.writer._id}`);
            }}
            className="flex gap-[1rem] items-center"
          >
            <div
              className="w-[40px] h-[40px] rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${postInfo.writer.profile})` }}
            ></div>
            <p className="text-sm">{postInfo.writer.nickname}</p>
          </div>
          {/* 제목, 내용 */}
          <p className="text-4xl pt-[2rem] truncate">{postInfo.title}</p>
          <p className="text-base py-[1rem] text-gray-500 truncate">
            {postInfo.preview.text}
          </p>
          {/* 하단 스크랩, 댓글 수 */}
          <div className="flex gap-[1rem] my-[1rem] items-center">
            {/* <div className="flex items-center gap-[1rem] mr-[10px]">
              <FaRegComment size={20} />
              <p>{postInfo.commentCount}</p>
            </div> */}
            <div
              className="flex gap-[0.5rem] items-center mr-[10px]"
              onClick={(e) => handleMarkClick(e)}
            >
              {scrap ? (
                <IoBookmark size={20} />
              ) : (
                <IoBookmarkOutline color="gray" size={20} />
              )}
              
              {/* <p>{postInfo.scrapingCount}</p> */}
              <p className="text-gray-500">{scrapCount}</p>
            </div>
            <div className="flex items-center gap-[0.5rem]">
              <FaRegComment color="gray" size={20} />
              <p className="text-gray-500">{postInfo.commentCount}</p>
            </div>
          </div>
          {/* 날짜 */}
          <div className="absolute top-0 right-0">
            <p className="text-[8px] md:text-xs text-gray-400">{updatedAt}</p>
          </div>
        </div>
      </div>

      {/* 대표사진 */}
      <div
        className="col-[7_/_9] bg-cover bg-center"
        style={{ backgroundImage: `url(${postInfo.preview.img})` }}
      ></div>
    </div>
  );
}
