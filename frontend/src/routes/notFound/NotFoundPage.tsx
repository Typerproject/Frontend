import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[100vh] flex-col justify-center text-center items-center gap-[25px]">
      <p className="text-5xl pb-[2rem] phone:text-[25px]">
        페이지를 찾을 수 없습니다.
      </p>
      <p className="phone:text-[15px] inline phone:hidden">
        존재하지 않는 주소를 입력하셨거나, 요청하신 페이지의 주소가 변경,
        삭제되어 찾을 수 없습니다.
      </p>
      <div className="hidden phone:inline flex flex-col gap-4">
        <p>존재하지 않는 주소를 입력하셨거나,</p>
        <p>요청하신 페이지의 주소가</p>
        <p>변경, 삭제되어 찾을 수 없습니다.</p>
      </div>
      <div className="flex gap-[2rem] mt-[3rem]">
        <button
          className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </button>
        <button
          className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
          onClick={() => navigate(-1)}
        >
          이전으로 돌아가기
        </button>
      </div>
    </div>
  );
}
