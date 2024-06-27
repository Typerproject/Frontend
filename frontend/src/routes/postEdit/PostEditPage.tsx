import { useEffect, useState } from "react";
import Editor from "./component/Editer";
import Timer from "../editor/component/Timer";
import { OutputData } from "@editorjs/editorjs";
import postAPI, { IPostDetail } from "../../api/postDetailAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

export default function PostEditPage() {
  //post 정보 state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<OutputData>();
  //   const [postDetail, setPostDetail] = useState<IPostDetail>({} as IPostDetail);

  const navigate = useNavigate();
  //로그인한 유저
  const userId = useAppSelector((state) => state.user._id);
  const { id } = useParams<{ id: string }>() as { id: string }; //postId

  // 일단 postData get으로 받기
  useEffect(() => {
    const fetchPostData = async (): Promise<void> => {
      service.getPost(id).then((res: IPostDetail) => {
        // setPostDetail(res);
        // console.log(res);
        setTitle(res.title);
        setContent(res.content);
        return res;
      });
    };

    fetchPostData();
  }, [id, userId]);

  const editPost = async () => {
    // 받고 state에 저장, outputData 넘겨주기
    // 수정 누를 시 내가 만든 api에 요청
    if (content !== undefined) {
      service
        .patchPost(id, title, content)
        .then((res) => {
          // console.log(res);
          alert("수정이 완료되었습니다.");
          navigate(-1);
        })
        .catch((e) => {
          // console.log(e);
          alert("수정에 실패하였습니다!");
        //   navigate(-1);
        });
    }
  };

  return (
    <>
      <div className="h-dvh">
        <nav className="bg-black h-4" />
        <div className="flex flex-col items-center">
          <input
            value={title}
            type="text"
            className="block w-11/12 p-4 text-4xl outline-none"
            placeholder="제목을 입력해주세요"
            maxLength={25}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Timer />
          {content && <Editor content={content} setContent={setContent} />}
        </div>
        <footer className="bg-black h-14 fixed bottom-0 right-0 left-0 flex items-center justify-between px-16 z-[100]">
          <p
            className="text-white text-xl cursor-pointer hover:opacity-80"
            onClick={() => navigate(-1)}
          >
            나가기
          </p>
          <div className="flex items-center w-[10%] justify-between">
            <p
              className="text-white text-xl cursor-pointer hover:opacity-80"
              onClick={editPost}
            >
              수정
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
