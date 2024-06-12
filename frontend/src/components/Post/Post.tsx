import { useState } from "react";
import { FaHeart } from "react-icons/fa6"; // 채워진 하트
import { FaRegHeart } from "react-icons/fa6"; // 빈 하트

export default function Post() {
  //게시글 아이디를 전달받아서 api호출을 통해 게시글 정보를 받아옴
  const title: string = "테스트 게시글 입니다.";
  const date: string = "2024-06-12 15:24:32";
  const userName: string = "CatisCute";
  const like: number = 231;
  const content: string = "내용 세 줄 요약해서 출력";
  const comment: number = 10;

  const [validHeart, setValidHeart] = useState(false);

  function handleLike() {
    setValidHeart(() => !validHeart);
    // 좋아요 보내는 로직
  }

  return (
    <div className="w-full p-[2rem]">
      {/* 날짜, 글쓴이 기본 정보 */}
      <div className="flex gap-[17rem] items-center">
        <div className="flex gap-[0.5rem] items-center">
          <img
            className="w-[40px] rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
          />
          <p className="text-sm">{userName}</p>
        </div>
        <p className="text-sm text-gray-400">{date}</p>
      </div>

      <div className="text-4xl mt-[1rem]">{title}</div>

      {/* 글 내용 */}
      <p className="text-base py-[2rem] text-gray-500">{content}</p>

      <div className="text-base flex items-center gap-[0.5rem]">
        <div onClick={() => handleLike()} className="cursor-pointer">
          {validHeart ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </div>
        <p>{like}</p>
        <p>{comment}</p>
      </div>
    </div>
  );
}
