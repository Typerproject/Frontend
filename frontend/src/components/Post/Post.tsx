import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAPI, { IUserInfo } from "../../api/userAPI";
import { FaHeart } from "react-icons/fa6"; // 채워진 하트
import { FaRegHeart } from "react-icons/fa6"; // 빈 하트
import { FaRegComment } from "react-icons/fa";

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function Post({ id }: { id: string | undefined }) {
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
  const title: string = "테스트 게시글 입니다.";
  const date: string = "2024-06-12 15:24:32";
  const like: number = 231;
  const content: string = "내용 세 줄 요약해서 출력";
  const comment: number = 10;
  const picture: string =
    "https://src.hidoc.co.kr/image/lib/2022/5/12/1652337370806_0.jpg"; //미리보기 사진

  const [validHeart, setValidHeart] = useState(false);

  function handleLike() {
    setValidHeart(() => !validHeart);
    // 좋아요 보내는 로직
  }

  return (
    <div className="w-full p-[2rem]">
      <div className="cursor-pointer ">
        {/* 날짜, 글쓴이 기본 정보 */}
        <div className="flex gap-[17rem] items-center mb-[1rem]">
          <div
            onClick={() => navigate("/my")}
            className="flex gap-[0.5rem] items-center"
          >
            <img className="w-[40px] rounded-full" src={userProfile} />
            <p className="text-sm">{userName}</p>
          </div>
          <p className="text-sm text-gray-400">{date}</p>
        </div>

        {/* 글 내용 */}
        <div className="flex">
          <div className="flex-1" onClick={() => navigate("/post")}>
            <div className="text-4xl mt-[1rem]">{title}</div>
            <p className="text-base py-[2rem] text-gray-500">{content}</p>
          </div>
          <div className="flex-none">
            <img className="w-[200px] rounded" src={picture} />
          </div>
        </div>
      </div>

      <div className="text-base flex items-center gap-[1.5rem]">
        <div className="flex items-center gap-[0.5rem] ">
          <div onClick={() => handleLike()} className="cursor-pointer">
            {validHeart ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
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
