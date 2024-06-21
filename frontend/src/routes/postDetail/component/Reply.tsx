import React from "react";
import { AiOutlineEnter } from "react-icons/ai";

// type Props = {};

export default function Reply() {
  return (
    <div className="ml-[2rem] grid grid-cols-12 gap-[1rem] items-center pl-[2rem] py-[2rem]">
      <AiOutlineEnter className="scale-x-[-1] m-[1rem]" width="40px" />
      <div className="col-[2_/_5] flex gap-[1rem] items-center">
        <img
          className="w-[40px] h-[40px] rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
        />
        <p className="text-sm">댓글 단 user~~~</p>
      </div>
      <div className="col-[5_/_13] grow flex justify-between items-center bg-gray-300 rounded-2xl px-[1.25rem] py-[0.75rem]">
        <p>오 글 좋네요 하트 누름^_^</p>
        <button className="w-[46px] h-[30px] bg-black text-white rounded-full border-[1px] border-black text-xs px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
          삭제
        </button>
      </div>
    </div>
  );
}