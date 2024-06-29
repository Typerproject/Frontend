import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useState, useEffect } from "react";
import ViewEditor from "./ViewEditor";
import postAPI, { IpostScrap } from "../../../api/postDetailAPI";
import { useNavigate, useParams } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import CommentList from "./CommentList";
import { FaRegComment } from "react-icons/fa";
import commentAPI from "../../../api/commentAPI";
import { useAppSelector } from "../../../store";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

type Props = {
  scrap: boolean;
  outputData: OutputData;
  setScrap: React.Dispatch<React.SetStateAction<boolean>>;
  scrapingCount: number;
  writerId: string;
};

const commentService = new commentAPI(import.meta.env.VITE_BASE_URI);

interface IprogressStyle {
  width: number;
  opacity: number;
}

export default function PostContent({
  scrap,
  setScrap,
  outputData,
  scrapingCount,
  writerId,
}: Props) {
  // const [vaildComment, setValidComment] = useState<boolean>(false);
  const currentUserId = useAppSelector((state) => state.user._id);
  const { id } = useParams<{ id: string }>() as { id: string };
  const navigate = useNavigate();

  const [progress, setProgress] = useState<IprogressStyle>(
    {} as IprogressStyle
  );
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetcthComments = async () => {
      commentService
        .getCommentList(id)
        .then((resp) => {
          setComments(resp);
        })
        .catch(() => {
          navigate("/notfound");
        });
    };
    fetcthComments();
  }, []);

  async function handleLike() {
    if (scrap) {
      service
        .deleteScrapPost(id)
        .then((res: IpostScrap) => {
          alert("스크랩 삭제 성공");
          setScrap(false);
          location.reload();
        })
        .catch((e) => {
          alert("스크랩 삭제에 실패하였습니다.");
        });
    } else {
      service
        .scrapPost(id)
        .then((res: IpostScrap) => {
          alert("스크랩 성공");
          setScrap(true);
          location.reload();
        })
        .catch((e) => {
          alert("스크랩에 실패하였습니다.");
        });
    }
  }

  const getElementPostion = () => {
    const mainPost = document.getElementById("mainPost");
    const progressBar = document.getElementById("progress-bar");
    const postEnd = document.getElementById("post-end");

    const scrollY = window.scrollY; // 스크롤 양

    const mainPostPosition =
      mainPost && Math.floor(scrollY + mainPost.getBoundingClientRect().top); // 절대위치, Math.floor로 정수로 변환

    const progressPostion =
      progressBar &&
      Math.floor(scrollY + progressBar.getBoundingClientRect().bottom);

    const postEndPosition =
      postEnd && Math.floor(scrollY + postEnd.getBoundingClientRect().top);

    // window.innerHeight + scrollY가 mainBottomPosition아래로 내려가면 -> progress bar width는 100%이상이 되어야 한다...
    setProgress({
      width: postEndPosition
        ? (Number(window.innerHeight + scrollY) / Number(postEndPosition)) * 100
        : 0,
      opacity:
        mainPostPosition && progressPostion
          ? Number(progressPostion > mainPostPosition)
          : 0,
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", getElementPostion); // 스크롤시 getBannerPosition 발생

    return () => window.removeEventListener("scroll", getElementPostion); // 클린업, 페이지를 나가면 이벤트 삭제
  }, []);

  const clickDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    const resp = await service.deletePost(id);

    if (resp.status !== 200) {
      alert("게시글 삭제 실패");
      return;
    }

    alert("삭제되었습니다.");
    navigate(-1);
  };

  const clickEdit = (): void => {
    if (window.confirm("게시글을 수정하시겠습니까?")) {
      navigate(`/edit/${id}`);
    }
  };

  return (
    <>
      <div
        id="mainPost"
        className="w-full h-full min-h-70 rounded-[10px] py-[4rem]"
      >
        <div
          id="progress-bar"
          className="fixed top-0 left-0 bg-[#388BFF] z-[99] h-[80px] "
          style={{
            width: `${progress.width}%`,
            opacity: `${progress.opacity}`,
            transition: "width .2s ease-out",
          }}
        ></div>

        {/* 글 내용 */}
        {outputData && <ViewEditor outPutData={outputData} />}

        <hr id="post-end" className="mb-[2rem]" />
        <div className="flex flex-row-reverse items-center gap-[1rem]">
          {/* 코멘트 수 */}
          <p>
            {comments.reduce((acc, cur) => {
              return acc + 1 + cur.replies.length;
            }, 0)}
          </p>
          <div
            className="cursor-pointer"
            // onClick={() => setValidComment((prev) => !prev)}
          >
            <FaRegComment />
          </div>
          <p className="mr-[10px]">{scrapingCount}</p>
          <div onClick={() => handleLike()} className="cursor-pointer">
            {scrap ? <IoBookmark size={20} /> : <IoBookmarkOutline size={20} />}
          </div>
          {currentUserId === writerId && (
            <>
              <div
                className="text-red-400 hover:bg-gray-400 rounded cursor-pointer"
                onClick={clickDelete}
              >
                삭제
              </div>
              <div
                className="text-blue-400 hover:bg-gray-400 rounded cursor-pointer"
                onClick={clickEdit}
              >
                수정
              </div>
            </>
          )}
        </div>
      </div>

      {comments && <CommentList comments={comments} />}
    </>
  );
}
