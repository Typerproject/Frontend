import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoKebabHorizontal } from "react-icons/go";

export default function FollowList() {
  const navigate = useNavigate();
  //props로 id, 이름, 프사 받아오기
  const [userName, setUserName] = useState("DogisCute");
  const [profileImg, setProfileImg] = useState(
    "https://i.namu.wiki/i/eZE2tbZyRnZq-oHCEprbnLd6F_yU0ZReQKV66QcwYXz9Ru-4OQ6ueDU84bcZRKDW3toounG6AqOLG_H23ifmdZqkKAZZ28AfmHXq0RmpJgMNA3yAan5j2rNOP0xacfeirE4FjMiemSIHtLTC8RKQ8w.webp"
  );
  const [dropBtn, setDropBtn] = useState(false);

  function handleDrop() {
    setDropBtn(!dropBtn);
  }

  return (
    <div className="flex gap-[10rem] items-center">
      <div
        className="flex gap-[1rem] cursor-pointer "
        onClick={() => navigate(`/post`)}
      >
        <img className="size-10 rounded-full" src={profileImg} />
        <p className="text-sm mt-[0.7rem] ">{userName}</p>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <div onClick={handleDrop} className="cursor-pointer">
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
                >
                  삭제
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
