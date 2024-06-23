// import { useNavigate } from "react-router-dom";
import Reply from "./Reply";
import { useState } from "react";

export default function Comment() {
  // const navigate = useNavigate();
  const [validInput, setValidInput] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-[1rem] my-[36px] w-full">
        <div
          style={{
            backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU)`,
          }}
          className="w-[32px] h-[32px] rounded-full bg-cover bg-center cursor-pointer"
        ></div>
        <div style={{ width: "calc(100% - 32px)" }}>
          <div className="mb-[1rem]">
            <p className="text-sm">댓글 단 user</p>
            <p className="text-xs text-gray-500">Jun 12. 2024.</p>
          </div>

          <p className="mb-[1rem]">오 글 좋네요 하트 누름^_^</p>
          <button
            onClick={() => setValidInput((prev) => !prev)}
            className="text-xs text-gray-500"
          >
            답글 달기
          </button>
        </div>
      </div>
      {validInput && (
        <div className="pl-[32px] w-full flex flex-col gap-[1rem] items-end	">
          <textarea className="resize-none	w-full h-[80px] border border-gray-300 outline-none	rounded-md" />
          <button className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] pt-[0.5rem] pb-[0.3rem] hover:bg-white hover:text-black duration-300">
            전송
          </button>
        </div>
      )}

      {/* 대댓글 리스트 돌리기 */}
      <Reply />
    </>
  );
}
