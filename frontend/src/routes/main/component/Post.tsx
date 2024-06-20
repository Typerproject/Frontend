import { useEffect, useState } from "react";
import userAPI from "../../../api/userAPI";
import postAPI, { IPost } from "../../../api/postDetailAPI";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
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
    <div className="w-full p-[2rem]">
      <div>
        <div className="flex cursor-pointer">
          {/* 미리보기 왼쪽 */}
          <div className="flex-grow-[3] basis-3/4 w-full">
            {/*글 정보*/}
            <div className="flex items-center gap-[15rem]">
              {/*유저 이름과 사진*/}
              <div
                onClick={() => navigate(`/my/{id}`)}
                className="flex gap-[0.5rem] items-center"
              >
                <img className="w-[40px] rounded-full" src={post.writer.img} />
                <p className="text-sm">{post.writer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">{post.createdAt}</p>
              </div>
            </div>
            <div>
              <div onClick={() => navigate(`/post/{postId}`)}>
                <div className="text-4xl mt-[1rem] max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {post.title}
                </div>
                <div className="text-base py-[2rem] text-gray-500">
                  {post.preview.text}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 미리보기 오른쪽 */}
        <div className="flex-grow basis-1/4">
          <div className="flex">
            {/*게시글 이미지*/}
            <div className="flex-none">
              <img className="w-[200px] rounded" src={post.preview.img} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-base flex items-center gap-[1.5rem]">
        <div className="flex items-center gap-[0.5rem] ">
          {isScraped ? (
            <div onClick={handleDeleteScraping} className="cursor-pointer">
              <IoBookmark size={20} />
            </div>
          ) : (
            <div onClick={handleScraping} className="cursor-pointer">
              <IoBookmarkOutline size={20} />
            </div>
          )}
          <p>{scrapCount}</p>
        </div>
        <div className="flex items-center gap-[0.5rem] ">
          <FaRegComment size={20} />
          {/* 코멘트 '개수'가 있다고 생각! */}
          <p>1억</p>
        </div>
      </div>
    </div>
  );
}
