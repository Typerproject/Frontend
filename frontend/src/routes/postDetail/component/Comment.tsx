// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Reply from "./Reply";
import { useState } from "react";

export default function Comment({ comment, service }) {
  const [text, setText] = useState<string>("");
  const { id } = useParams<{ id: string }>() as { id: string };

  const parsingDate = (): string => {
    const date = new Date(comment.createdAt);

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

  const submitComment = async (): Promise<void> => {
    try {
      const resp = await service.postReply({
        text,
        postId: id,
        parentCommentId: comment._id,
      });

      console.log(resp);
      if (resp.status !== 201) {
        throw Error("댓글 작성 실패");
      } else {
        setText("");
        history.scrollRestoration = "auto";
        location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const [validInput, setValidInput] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-[1rem] my-[36px] w-full">
        <div
          style={{
            backgroundImage: `url(${comment.writerId.profile})`,
          }}
          className="w-[32px] h-[32px] rounded-full bg-cover bg-center cursor-pointer"
        ></div>
        <div style={{ width: "calc(100% - 32px)" }}>
          <div className="mb-[1rem]">
            <p className="text-sm">{comment.writerId.nickname}</p>
            <p className="text-xs text-gray-500">{parsingDate()}</p>
          </div>

          <p className="mb-[1rem]">{comment.text}</p>
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
          <textarea
            onChange={(e) => {
              setText(e.target.value);
            }}
            className="resize-none	w-full h-[80px] border border-gray-300 outline-none	rounded-md"
          />
          <button
            onClick={submitComment}
            className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] pt-[0.5rem] pb-[0.3rem] hover:bg-white hover:text-black duration-300"
          >
            전송
          </button>
        </div>
      )}

      {comment.replies.map((ele, idx) => {
        return <Reply key={idx} reply={ele} />;
      })}
    </>
  );
}
