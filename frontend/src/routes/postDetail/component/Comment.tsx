// type Props = {}
import { useNavigate } from "react-router-dom";

export default function Comment() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-[1rem] items-center">
      <div onClick={()=>navigate("/my")}
      className="flex gap-[1rem] items-center"
      >
      <img
        className="w-[40px] h-[40px] rounded-full"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
      />
      <p className="text-sm">댓글 단 user</p>
      </div>
      <div className="relative grow bg-gray-300 rounded-full pl-[1.25rem] pr-[4.25rem] py-[0.75rem]">
        <p>오 글 좋네요 하트 누름^_^</p>
        <button className="absolute right-[0px] top-[50%] translate-y-[-50%] translate-x-[-25%] bg-black text-white rounded-full border-[1px] border-black text-xs px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
          삭제
        </button>
      </div>
    </div>
  );
}
