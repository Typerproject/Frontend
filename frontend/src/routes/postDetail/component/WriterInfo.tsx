// type Props = {}
import { useNavigate } from "react-router-dom";
import { IPostWriter } from "../../../api/postDetailAPI";
import { useAppSelector } from "../../../store";
import { useEffect, useState } from "react";
import userAPI from "../../../api/userAPI";

type Props = {
  writer: IPostWriter;
};
const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function WriterInfo({ writer }: Props) {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user._id);

  const isWriter = userId === writer.writerId;
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  async function handleFollowClick() {
    const result = await service.followingUser(writer.writerId);

    if(result.response === true) {
      setIsFollowing(true);
    } else {
      alert("팔로우 실패")
    }
    console.log("followingUser result:", result);
  }

  async function handleUnfollowClick() {
    const result = await service.deleteFollowingUser(writer.writerId);
    if(result.response === true) {
      setIsFollowing(false);
    } else {
      alert("언팔로우 실패")
    }
    console.log("unfollow..", result);
  }

  useEffect(() => {
    //follow 여부 state에 저장
    const checkFollow = async (): Promise<void> => {
      if (userId) {
        const followingList = await service
          .getFollowingAndFollowerData(userId)
          .then((data) => data.followingUsers);

        let flag = false;
        followingList.forEach((user) => {
          if (user._id === writer.writerId) flag = true;
        });

        setIsFollowing(flag);
      }
    };
    checkFollow();
  }, []);

  return (
    <div className="flex items-center gap-[0.75rem] py-[0.75rem]">
      <div
        className="flex items-center gap-[0.75rem] cursor-pointer"
        onClick={() => navigate(`/my/${writer.writerId}`)}
      >
        <img className="w-[40px] rounded-full" src={writer.img} />
        <p className="text-sm">{writer.name}</p>
      </div>

      {!isWriter &&
        (isFollowing ? (
          <button
            onClick={handleUnfollowClick} // unFollowClick 함수로 수정
            className="m-0 text-xs border-[1px] bg-red-500 text-gray-50 rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
          >
            Unfollow
          </button>
        ) : (
          <button
            className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
            onClick={handleFollowClick}
          >
            Follow
          </button>
        ))}
    </div>
  );
}
