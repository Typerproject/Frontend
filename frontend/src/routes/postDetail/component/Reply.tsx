// type Props = {};

import { useAppSelector } from "../../../store";

export default function Reply({ reply, service }) {
  const currentUserId = useAppSelector((state) => state.user._id);

  const parsingDate = (): string => {
    const date = new Date(reply.createdAt);

    const formattedTime = date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedTime;
  };

  const deleteComment = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    const res = await service.deleteComment(reply._id);

    console.log(res);
    if (res.status === 200) {
      history.scrollRestoration = "auto";
      location.reload();
      alert("삭제되었습니다.");
      return;
    }
    alert("삭제 실패");
  };

  return (
    <div className="flex gap-[1rem] my-[36px] pl-[32px] w-full">
      <div
        style={{
          backgroundImage: `url(${reply.writerId.profile})`,
        }}
        className="w-[32px] h-[32px] rounded-full bg-cover bg-center cursor-pointer"
      ></div>
      <div style={{ width: "calc(100% - 32px)" }}>
        <div className="mb-[1rem]">
          <p className="text-sm">{reply.writerId.nickname}</p>
          <p className="text-xs text-gray-500">{parsingDate()}</p>
        </div>
        <p className="mb-[1rem]">{reply.text}</p>
      </div>
      {currentUserId === reply.writerId.id && (
        <div
          className="flex w-[5%] h-fit justify-center hover:bg-red-200 rounded"
          onClick={deleteComment}
        >
          삭제
        </div>
      )}
    </div>
  );
}
