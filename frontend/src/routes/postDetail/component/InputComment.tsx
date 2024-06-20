// import React from 'react'
import { useAppSelector } from "../../../store";
import { BsPersonCircle } from "react-icons/bs";
import { useState } from "react";
import commentAPI from "../../../api/commentAPI";
import { useParams } from "react-router-dom";

const service = new commentAPI(import.meta.env.VITE_BASE_URI);

export default function InputComment() {
  const userInfo = useAppSelector((state) => state.user);
  const [text, setText] = useState<string>("");

  const {id} = useParams<{id:string}>() as { id: string };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
    // console.log(e.target.value);  
  };

  const submitComment = async (): Promise<void> => {
    try {
      
      const resp = await service.postComment({text, postId: id});

      console.log(resp);
      if(resp.status !== 201) {
        throw Error("댓글 작성 실패")
      }

    } catch (error) {
      console.log(error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  return (
    <>
      {userInfo._id && (
        <div className="flex gap-[1rem] items-center mt-[2rem]">
          {userInfo.profile ? (
            <img className="w-[40px] rounded-full" src={userInfo.profile} />
          ) : (
            <BsPersonCircle size={40} color="gray" />
          )}
          <p className="text-sm">{userInfo.nickname}</p>
          <div className="grow relative bg-gray-300 rounded-2xl pl-[1.25rem] pr-[4.25rem] py-[0.75rem] ">
            <textarea
              onChange={handleInput}
              className="w-full bg-transparent outline-none	max-h-[50px] h-[20px]"
            />
            <button
              onClick={submitComment}
              className="absolute right-[0px] top-[50%]  translate-y-[-50%] translate-x-[-25%] bg-black text-white rounded-full border-[1px] border-black text-xs px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
            >
              등록
            </button>
          </div>
        </div>
      )}
    </>
  );
}
