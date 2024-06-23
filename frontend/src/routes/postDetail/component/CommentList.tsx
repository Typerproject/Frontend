import Comment from "./Comment";
// type Props = {}

export default function CommentList() {
  return (
    <div className="mb-[5rem]">
      <p>댓글 14</p>
      <hr className="my-[2rem]"/>
      {/* 정보 받았을 때 이런 형태로 돌리기 */}
      {/* {Array.map((comment) => (
        <Comment />
      ))} */}
      <Comment />

      <div className="w-full flex flex-col gap-[1rem] items-end	">
          <textarea className="resize-none	w-full h-[80px] border border-gray-300 outline-none	rounded-md" />
          <button className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] pt-[0.5rem] pb-[0.3rem] hover:bg-white hover:text-black duration-300">
            댓글 달기
          </button>
        </div>
    </div>
  );
}
