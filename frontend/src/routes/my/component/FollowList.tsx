import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userAPI from "../../../api/userAPI";
import { useAppSelector } from "../../../store";

interface FollowListProps {
  _id: string;
  nickname: string;
  profile: string;
  which: string;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function FollowList({
  _id,
  nickname,
  profile,
  which,
  setRefreshKey,
}: FollowListProps) {
  const navigate = useNavigate();
  //props로 id, 이름, 프사 받아오기

  // const [dropBtn, setDropBtn] = useState(false);

  const currentUser = useAppSelector((state) => state.user);

  const { id } = useParams<{ id: string }>();

  // function handleDrop() {
  //   setDropBtn(!dropBtn);
  // }

  function handleDelete() {
    const direction = which === "following" ? true : false;

    console.log("direction", direction);

    if (direction) {
      // 팔로잉 취소
      service
        .deleteFollowingUser(_id)
        .then((result) => {
          console.log("in FollowList followingUser result:", result);
          setRefreshKey((prevKey) => prevKey + 1);
        })
        .catch((err) => {
          console.error("In FollowList unfollowing error", err);
        });
    } else {
      // 팔로워를 지우는 거
      service
        .deleteFollowerUser(_id)
        .then((result) => {
          console.log("in FollowList followerUser result:", result);
          setRefreshKey((prevKey) => prevKey + 1);
        })
        .catch((err) => {
          console.error("In FollowList unfollower error", err);
        });
    }
  }

  return (
    <div className="flex flex-row justify-left items-center w-18rem mb-[1rem]">
      <div
        className="flex gap-[1rem] cursor-pointer w-30"
        onClick={() => navigate(`/my/${_id}`)}
      >
        <img className="size-10 rounded-full" src={profile} />
        <p className="text-sm mt-[0.7rem] w-32">{nickname}</p>
      </div>

      {/* <div style={{ position: "relative", display: "inline-block" }}> */}
      <div className="">
        {currentUser._id === id ? (
          <div className="cursor-pointer ml-4">
            <button
              onClick={handleDelete}
              className="text-xs mt-[0.7rem] border-[1px] bg-red-500 text-gray-50 rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
            >
              Delete
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
