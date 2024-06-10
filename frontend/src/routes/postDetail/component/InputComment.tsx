// import React from 'react'

// type Props = {}

export default function InputComment() {
  return (
    <div className="flex gap-[1rem] items-center mt-[2rem]">
      <img
        className="w-[40px] h-[40px] rounded-full"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
      />
      <p className="text-sm">로그인 한 user</p>
      <div className="grow relative">
        <input className="w-full bg-gray-300 rounded-full px-[1.25rem] py-[0.75rem]" />
        <button className="absolute right-[0px] top-[50%] translate-y-[-50%] translate-x-[-25%] bg-black text-white rounded-full border-[1px] border-black text-xs px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">등록</button>
      </div>
    </div>
  );
}
