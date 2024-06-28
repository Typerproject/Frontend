import { useState } from "react";
import postAPI, { IPost } from "../../../api/postDetailAPI";
import { FaRegComment, FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

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
        setIsScraped(true);
        setScrapCount(scrapCount + 1);
      })
      .catch((err) => {
        console.error("스크랩 하기 error: ", err);
      });
  };

  // 스크랩 취소 핸들러
  const handleDeleteScraping = () => {
    postService
      .deleteScrapPost(post._id)
      .then((result) => {
        setIsScraped(false);
        setScrapCount(scrapCount - 1);
      })
      .catch((err) => {
        console.error("스크랩 취소 error: ", err);
      });
  };

  return (
    <>
      <div className="flex flex-row mx-[2rem] px-[1rem] py-[2rem] justify-between mb-4 hover:bg-gray-200 hover:rounded-lg duration-200">
        <div className="flex-1 flex flex-col gap-[10px] justify-between">
          <div>
            <div className="flex cursor-pointer">
              {/* 미리보기 왼쪽*/}
              <div
                className="flex-grow-[3] basis-3/4 w-full mr-10"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <div className="flex flex-col items-start gap-[1rem] mb-[1rem]">
                  {/*글 정보*/}
                  <div className="flex flex-col mmd:flex-row mmd:justify-between gap-[1rem] w-full">
                    {/*유저 이름과 사진*/}
                    <div>
                      <div className="flex gap-[0.5rem] items-center">
                        <img
                          className="w-[40px] rounded-full"
                          src={post.writer.img}
                        />
                        <div className="text-base min-w-full break-words break-all">
                          {post.writer.nickname}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{formattedTime}</p>
                    </div>
                  </div>
                  <div onClick={() => navigate(`/post/${post._id}`)}>
                    <div>
                      <div className="text-3xl font-semibold mt-[1.2rem] max-w-full sm:max-w-4xl md:max-w-3xl lg:max-w-2xl xl:max-w-xl overflow-hidden xl:text-ellipsis whitespace-normal break-words break-all">
                        {post.title}
                      </div>
                      <div className="text-base mt-[0.7rem] text-gray-500 break-words break-all">
                        {truncateText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 미리보기 오른쪽 */}
              <div
                onClick={() => navigate(`/post/${post._id}`)}
                className="hidden md:flex md:flex-grow md:basis-1/4"
              >
                <div className="flex w-full h-full">
                  <div
                    className="w-3/4 mmd:w-full h-full rounded"
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
              <p>{post.commentCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
