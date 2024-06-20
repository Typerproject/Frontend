import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAPI, { IUserInfo } from "../../api/userAPI";
// import { FaHeart } from "react-icons/fa6"; // 채워진 하트
// import { FaRegHeart } from "react-icons/fa6"; // 빈 하트
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";

const service = new userAPI(import.meta.env.VITE_BASE_URI);

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
  post: Preview;
}

//게시글을 작성한 유저의 id와 user/info/:_id에서 가져온 게시글 정보 필요
export default function Post({ id, post }: User) {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  //유저 정보 가져오기
  useEffect(() => {
    if (id) {
      console.log("파라미터 잘 가져와 지나?", id);

      // 유저 정보 겟또다제
      service
        .getUserInfo(id)
        .then((data) => {
          console.log("마페 유저", data);
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("마페 유저", err);
        });
      console.log("post에 띄울 유저 정보 가져오기 성공");
    } else {
      console.log("post에 띄울 유저 정보 가져오기 실패");
    }
  }, [id]);

  //유저의 정보
  const userName: string | undefined = userInfo?.nickname;
  const userProfile: string | undefined = userInfo?.profile;

  //api호출을 통해 게시글 정보를 받아옴
  const title: string = post.title;
  const date: string = post.createdAt;
  const like: number = post.scrapingCount;
  const content: string = post.preview.text;
  const comment: number = 10;
  const picture: string = post.preview.img; //미리보기 사진
  const postId: string = post._id;

  const [validHeart, setValidHeart] = useState(false);

  function handleLike() {
    setValidHeart(() => !validHeart);
    // 좋아요 보내는 로직
  }

  return (
    <div className="w-full p-[2rem]">
      <div>
        <div className="flex cursor-pointer">
          {/* 미리보기 왼쪽*/}
          <div className="flex-grow-[3] basis-3/4 w-full">
            <div className="flex flex-col items-start gap-[1rem] mb-[1rem]">
              {/*글 정보*/}
              <div className="flex items-center gap-[15rem]">
                {/*유저 이름과 사진*/}
                <div
                  onClick={() => navigate(`/my/${id}`)}
                  className="flex gap-[0.5rem] items-center"
                >
                  <img className="w-[40px] rounded-full" src={userProfile} />
                  <div className="text-sm min-w-full">{userName}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{date}</p>
                </div>
              </div>
              <div>
                <div onClick={() => navigate(`/post/${postId}`)}>
                  <div className="text-4xl mt-[1rem] max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {title}
                  </div>
                  <div className="text-base py-[2rem] text-gray-500">
                    {content}
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
                <img className="w-[200px] rounded" src={picture} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-base flex items-center gap-[1.5rem]">
        <div className="flex items-center gap-[0.5rem] ">
          <div onClick={() => handleLike()} className="cursor-pointer">
            {validHeart ? (
              <IoBookmark size={20} />
            ) : (
              <IoBookmarkOutline size={20} />
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
