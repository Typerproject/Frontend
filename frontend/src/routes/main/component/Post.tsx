import { useEffect, useState } from "react";
import userAPI from "../../../api/userAPI";
import postAPI, { IPost } from "../../../api/postDetailAPI";
import { FaRegComment, FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const useService = new userAPI(import.meta.env.VITE_BASE_URI);
const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

// 스크랩/코멘트 누르면 로그인 요청 알럿 + login 창 뜨도록?
// 스크랩 하기 => scrapPost / 취소 => deleteScrapPost

interface MainPostProps {
  post: IPost;
}

export default function MainPost({ post }: MainPostProps) {
  const [scrapCount, setScrapCount] = useState(post.scrapingCount);
  const [isScraped, setIsScraped] = useState(post.isScrapped);

  const navigate = useNavigate();

  const truncateText =
    post.preview.text.length > 100
      ? post.preview.text.slice(0, 100) + "..."
      : post.preview.text;

  const koreaDate = new Date(post.createdAt);
  //   const koreaDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const formattedTime = koreaDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 스크랩 하기 핸들러
  const handleScraping = () => {
    postService
      .scrapPost(post._id)
      .then((result) => {
        console.log("스크랩 하기", result);
        setIsScraped(true);
        setScrapCount(scrapCount + 1);
      })
      .catch((err) => {
        console.log("스크랩 하기 error: ", err);
      });
  };

  // 스크랩 취소 핸들러
  const handleDeleteScraping = () => {
    postService
      .deleteScrapPost(post._id)
      .then((result) => {
        console.log("스크랩 취소", result);
        setIsScraped(false);
        setScrapCount(scrapCount - 1);
      })
      .catch((err) => {
        console.error("스크랩 취소 error: ", err);
      });
  };

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        {/* 텍스트 */}
        <div className="flex-1 flex flex-col gap-[10px] justify-between">
          <div className="flex flex-col mmd:flex-row mmd:justify-between gap-[1rem] w-full">
            {/*유저 이름과 사진*/}
            <div>
              <div
                onClick={() => navigate(`/my/${post.writer.id}`)}
                className="flex gap-[0.5rem] items-center cursor-pointer"
              >
                <img className="w-[40px] rounded-full" src={post.writer.img} />
                <div className="text-base min-w-full">{post.writer.name}</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">{formattedTime}</p>
            </div>
          </div>

          <div className="flex min-h-32">
            <div className="flex-grow-[3] basis-3/4 w-full mr-10">
              <p
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-[24px] cursor-pointer"
              >
                {post.title}
              </p>
              <p
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-[14px] cursor-pointer"
                style={{ color: "#595959" }}
              >
                {truncateText}
              </p>
            </div>

            {/* 이미지 */}
            <div
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex-grow basis-1/4"
            >
              {/* <img className="h-[180px] object-contain" src={post.preview.img} /> */}
              <div className="flex w-full h-full">
                <div
                  className="w-full h-full object-contain"
                  style={{
                    backgroundImage: `url(${post.preview.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100%",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[1.5rem]">
            <div className="flex items-center gap-[0.5rem]">
              {isScraped ? (
                <div
                  onClick={handleDeleteScraping}
                  className="mt-[1px] cursor-pointer"
                >
                  <FaBookmark size={16} />
                </div>
              ) : (
                <div
                  onClick={handleScraping}
                  className="mt-[1px] cursor-pointer"
                >
                  <FaRegBookmark size={16} />
                </div>
              )}
              <p>{scrapCount}</p>
            </div>

            <div
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex items-center gap-[0.5rem] cursor-pointer"
            >
              <FaRegComment size={16} />
              {/* 코멘트 '개수'가 있다고 생각! */}
              <p>1억</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-200 mb-4" />
    </>
  );
}
