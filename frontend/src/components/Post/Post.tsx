import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAPI, { IUserInfo } from "../../api/userAPI";
import postAPI from "../../api/postDetailAPI";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";

const service = new userAPI(import.meta.env.VITE_BASE_URI);
const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

export interface Pre {
  text: string;
  img: string;
  _id: string;
}

interface Preview {
  title: string;
  _id: string;
  preview: Pre;
  createdAt: string;
  public: boolean;
  scrapingCount: number;
}

interface User {
  id: string | undefined;
  nickname: string | undefined;
  profile: string | undefined;
  post: Preview;
  scrapped: boolean;
}

//게시글을 작성한 유저의 id와 user/info/:_id에서 가져온 게시글 정보 필요
export default function Post({ id, nickname, profile, post, scrapped }: User) {
  const navigate = useNavigate();

  const userName: string | undefined = nickname;
  const userProfile: string | undefined = profile;
  //const currentUser = useAppSelector((state) => state.user);

  //api호출을 통해 게시글 정보를 받아옴
  const title: string = post.title;
  const [like, setLike] = useState(post.scrapingCount);
  const [validLike, setValidLike] = useState(scrapped);
  const content: string = post.preview.text;
  const comment: number = 10;
  const picture: string = post.preview.img; //미리보기 사진
  const postId: string = post._id;

  const koreaDate = new Date(post.createdAt);

  const date = koreaDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  useEffect(() => {
    setValidLike(scrapped);
  }, [scrapped]);

  // 스크랩 하기 핸들러
  const handleLike = () => {
    postService
      .scrapPost(postId)
      .then((result) => {
        console.log("스크랩 하기", result);
        setValidLike(true);
        setLike(like + 1);
      })
      .catch((err) => {
        console.log("스크랩 하기 error: ", err);
      });
  };

  // 스크랩 취소 핸들러
  const handleDeleteLike = () => {
    postService
      .deleteScrapPost(postId)
      .then((result) => {
        console.log("스크랩 취소", result);
        setValidLike(false);
        setLike(like - 1);
      })
      .catch((err) => {
        console.error("스크랩 취소 error: ", err);
      });
  };

  return (
    <div className="w-full p-[2rem] hover:bg-gray-100 hover:rounded-lg">
      <div onClick={() => navigate(`/post/${postId}`)}>
        <div className="flex cursor-pointer">
          {/* 미리보기 왼쪽*/}
          <div className="flex-grow-[3] basis-3/4 w-full mr-10">
            <div className="flex flex-col items-start gap-[1rem] mb-[1rem]">
              {/*글 정보*/}
              <div className="flex flex-col mmd:flex-row mmd:justify-between gap-[1rem] w-full">
                {/*유저 이름과 사진*/}
                <div>
                  <div
                    onClick={() => navigate(`/my/${id}`)}
                    className="flex gap-[0.5rem] items-center"
                  >
                    <img className="w-[40px] rounded-full" src={userProfile} />
                    <div className="text-base min-w-full">{userName}</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{date}</p>
                </div>
              </div>
              <div>
                <div>
                  <div className="text-3xl font-semibold mt-[1.2rem] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {title}
                  </div>
                  <div className="text-base mt-[0.7rem] text-gray-500 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 오른쪽 */}
          <div className="flex-grow basis-1/4 phone:hidden">
            <div className="flex w-full h-full">
              <div
                // bg-center bg-cover
                className="w-full h-full rounded"
                style={{
                  backgroundImage: `url(${picture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-base text-gray-500 flex items-center gap-[1.5rem] mt-[1rem]">
        <div className="flex items-center gap-[0.5rem] ">
          <div>
            {validLike ? (
              <div onClick={handleDeleteLike} className="cursor-pointer">
                <FaBookmark size={20} color="black" />{" "}
              </div>
            ) : (
              <div onClick={handleLike} className="cursor-pointer">
                <FaRegBookmark size={20} />
              </div>
            )}
          </div>
          <p>{like}</p>
        </div>
        <div className="flex items-center gap-[0.5rem] ">
          <FaRegComment size={20} />
          <p>{comment}</p>
        </div>
      </div>
    </div>
  );
}
