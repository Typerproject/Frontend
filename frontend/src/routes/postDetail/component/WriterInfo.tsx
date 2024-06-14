// type Props = {}
import { useNavigate } from "react-router-dom";
import { IPostWriter } from "../../../api/postDetailAPI";

type Props = {
  writer: IPostWriter;
};

export default function WriterInfo({ writer }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-[0.75rem] py-[0.75rem]">
      <div
        className="flex items-center gap-[0.75rem] cursor-pointer"
        onClick={() => navigate(`/my/${writer.writerId}`)}
      >
        <img className="w-[40px] rounded-full" src={writer.img} />
        <p className="text-sm">{writer.name}</p>
      </div>
      <button className="text-xs border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300">
        팔로우
      </button>
    </div>
  );
}
