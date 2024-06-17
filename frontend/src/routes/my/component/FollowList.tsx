import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoKebabHorizontal } from "react-icons/go";
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

  const [dropBtn, setDropBtn] = useState(false);

  const currentUser = useAppSelector((state) => state.user);

  const { id } = useParams<{ id: string }>();

  function handleDrop() {
    setDropBtn(!dropBtn);
  }

  function handleDelete() {
    const direction = which === "following" ? true : false;

    console.log("direction", direction);

    if (direction) {
      // 팔로잉 취소
      service
        .deleteFollowingUser(_id)
        .then((result) => {
          console.log("in FollowList followingUser result:", result);
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
        })
        .catch((err) => {
          console.error("In FollowList unfollower error", err);
        });
    }

    setRefreshKey((prevKey) => prevKey + 1);
  }

  console.log("이 사람의 id는 ", _id);

  return (
    <div className="flex flex-row justify-left items-center w-18rem mt-3">
      <div
        className="flex gap-[1rem] cursor-pointer w-30"
        onClick={() => navigate(`/my/${_id}`)}
      >
        <img className="size-10 rounded-full" src={profile} />
        <p className="text-sm mt-[0.7rem] w-32">{nickname}</p>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        {currentUser._id === id ? (
          <div onClick={handleDrop} className="cursor-pointer ml-4">
            <GoKebabHorizontal />
            {dropBtn && (
              /*클릭 시 팔로우,팔로잉 취소 api 호출*/
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  backgroundColor: "white",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "4px",
                  zIndex: 1000,
                  width: "35px",
                }}
              >
                <ul style={{ margin: 0, padding: "8px 0", listStyle: "none" }}>
                  <li
                    style={{ listStyle: "none", textAlign: "center" }}
                    className="text-sm cursor-pointer"
                    onClick={handleDelete}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
