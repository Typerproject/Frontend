// type Props = {}
import { useNavigate } from "react-router-dom";

export default function WriterInfo() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-[0.75rem] py-[0.75rem]">
      <div
      className="flex items-center gap-[0.75rem] cursor-pointer"
       onClick={() => navigate("/my")}>
        <img
          className="w-[40px] rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU"
        />
        <p className="text-sm">경진씨</p>
      </div>
      <button className="text-xs border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
        팔로우
      </button>
    </div>
  );
}
