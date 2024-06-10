import WriterInfo from "./WriterInfo"

// type Props = {}

export default function PostContent() {
  return (
    <div className="w-full h-full min-h-70 rounded-[10px] shadow-lg shadow-[0_0_8px_5px] shadow-gray-200 p-[2rem]">

        {/* 글 제목, 날짜, 글쓴이 기본 정보 */}
        <h1 className="text-3xl	font-bold">게시글 상세 페이지</h1>
        <p className="text-gray-400 my-[10px]">2024년 06월 07일 13:23</p>
        <WriterInfo />

        {/* divider */}
        <div className="h-[0.5px] my-[0.75rem] w-full bg-current"></div>

        {/* 글 내용 */}
        <p className="py-[0.75rem]">글 내용 (따로 컴포로 뺄 예정)</p>
    </div>
  )
}