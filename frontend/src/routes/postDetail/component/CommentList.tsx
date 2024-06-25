import Comment from "./Comment";
import { useState } from "react";
import commentAPI from "../../../api/commentAPI";
import { useParams } from "react-router-dom";

// type Props = {}

const service = new commentAPI(import.meta.env.VITE_BASE_URI);

export default function CommentList({ comments }) {
  const [text, setText] = useState<string>("");
  const { id } = useParams<{ id: string }>() as { id: string };

  const submitComment = async (): Promise<void> => {
    try {
      const resp = await service.postComment({ text, postId: id });

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

  return (
    <div className="mb-[5rem]">
      <p>댓글 {comments.length}</p>
      <hr className="my-[2rem]" />

      {comments.map((ele, idx) => {
        return <Comment key={idx} comment={ele} service={service} />;
      })}

      <div className="w-full flex flex-col gap-[1rem] items-end	">
        <textarea
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          value={text}
          className="p-[1rem] resize-none	w-full h-[80px] border border-gray-300 outline-none	rounded-md"
        />
        <button
          onClick={submitComment}
          className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] pt-[0.5rem] pb-[0.3rem] hover:bg-white hover:text-black duration-300"
        >
          댓글 달기
        </button>
      </div>
    </div>
  );
}
