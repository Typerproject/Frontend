// import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Follow from "./component/Follow";

// type Props = {}

type State = "follower" | "following" | false;

export default function MyPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("CatisCute");
  const [profileImg, setProfileImg] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
  );
  const [profileIntro, setProfileIntro] = useState(
    "Cats are cute, but dogs are cuter🐾"
  );
  const [followerCount, setFollowerCount] = useState(1231);
  const [followingCount, setFollowingCount] = useState(53);
  const [follow, setFollow] = useState<State>(false);

  const handleFollowerBtn = () => {
    if (follow != "follower") {
      setFollow("follower");
    } else {
      setFollow(false);
    }
  };

  const handleFollowingBtn = () => {
    if (follow != "following") {
      setFollow("following");
    } else {
      setFollow(false);
    }
  };

  return (
    <div className="mt-[7rem]">
      {/*글 목록*/}
      <div className="grid grid-cols-3">
        <div className="col-span-2 flex justify-center  text-5xl">
          <p>{userName}'s Typer</p>
        </div>

        {/*프로필*/}
        <div className="col-span-1">
          <div>
            <img className="size-24 rounded-full" src={profileImg} />
            <p className="text-3xl mt-[0.7rem] ">{userName}</p>

            <div className={`flex gap-5  mt-[0.5rem] text-[#b1b2b3]`}>
              <span
                onClick={handleFollowerBtn}
                className={`hover:text-[#141414] cursor-pointer  ${
                  follow === "follower" ? "text-[#141414]" : "text-[#b1b2b3]"
                }`}
              >
                {followerCount} followers
              </span>
              <span
                onClick={handleFollowingBtn}
                className={`hover:text-[#141414] cursor-pointer ${
                  follow === "following" ? "text-[#141414]" : "text-[#b1b2b3]"
                }`}
              >
                {followingCount} following
              </span>
            </div>
            <p className="flex gap-10 text-[#88898a] mt-[0.7rem]">
              {profileIntro}
            </p>
            <button className="text-xs mt-[0.7rem] border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
              팔로우
            </button>
          </div>

          {/*팔로잉팔로우*/}
          <div>
            {follow === "follower" && (
              <div>
                <div className="mt-[3rem]">
                  <p className="text-lg">Follower</p>
                </div>
              </div>
            )}
            {follow === "following" && (
              <div>
                <div className="mt-[3rem]">
                  <p className="text-lg">Following</p>
                </div>
              </div>
            )}

            {/*보여줄 리스트가 팔로잉인지 팔로워인지 구분해서 api 호출
            가져온 정보 배열을 map 돌면서 props로 넘겨주기*/}
            {follow != false && (
              //클릭 시 해당 사람의 마이페이지로
              <div className="cursor-pointer" onClick={() => navigate(`/post`)}>
                <Follow />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
