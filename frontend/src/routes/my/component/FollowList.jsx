import { useState } from "react";

export default function FollowList() {
  //props로 id, 이름, 프사 받아오기
  const [userName, setUserName] = useState("DogisCute");
  const [profileImg, setProfileImg] = useState(
    "https://i.namu.wiki/i/eZE2tbZyRnZq-oHCEprbnLd6F_yU0ZReQKV66QcwYXz9Ru-4OQ6ueDU84bcZRKDW3toounG6AqOLG_H23ifmdZqkKAZZ28AfmHXq0RmpJgMNA3yAan5j2rNOP0xacfeirE4FjMiemSIHtLTC8RKQ8w.webp"
  );

  return (
    <div>
      <div className="flex gap-[1rem]">
        <img className="size-10 rounded-full" src={profileImg} />
        <p className="text-sm mt-[0.7rem] ">{userName}</p>
      </div>
    </div>
  );
}
