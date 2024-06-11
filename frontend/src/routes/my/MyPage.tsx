// import React from 'react'

// type Props = {}

export default function MyPage() {
  const userId = "CatisCute";
  const profileImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU";
  const profileIntro = "Cats are cute, but dogs are cuter🐾";
  const follower = 1231;
  const following = 53;

  return (
    <div className="mt-[7rem]">
      <div className="grid grid-cols-3">
        <div className="col-span-2 flex justify-center  text-5xl">
          <p>{userId}'s Typer</p>
        </div>
        <div className="col-span-1">
          <div>
            <img className="size-24 rounded-full" src={profileImg} />
            <p className="text-3xl mt-[0.5rem] ">{userId}</p>
            <div className="flex gap-10 text-[#b1b2b3] mt-[0.3rem]">
              <span>{follower} followers</span>
              <span>{following} following</span>
            </div>
            <p className="flex gap-10 text-[#9d9d9e] mt-[0.5rem]">
              {profileIntro}
            </p>
            <button className="text-xs mt-[0.5rem] border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
              팔로우
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
