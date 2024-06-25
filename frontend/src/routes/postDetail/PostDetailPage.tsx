import PostContent from "./component/PostContent";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import postAPI, { IPostDetail } from "../../api/postDetailAPI";
import userAPI, { IFollowerInfo, IDifferentUser } from "../../api/userAPI";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);
const userService = new userAPI(import.meta.env.VITE_BASE_URI);

export default function PostDetail() {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user._id);

  //post정보 fetch
  const [postDetail, setPostDetail] = useState<IPostDetail>({} as IPostDetail);
  const [scrap, setScrap] = useState<boolean>(false);
  const [isWriter, setIsWriter] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>() as { id: string };

  useEffect(() => {
    const fetchPostData = async (): Promise<void> => {
      const postDetailData = await service
        .getPost(id)
        .then((res: IPostDetail) => {
          setPostDetail(res);
          setIsWriter(userId === res.writer.writerId);
          setScrap(res.isScrapped);
          return res;
        });

      // writer가 팔로우 리스트에 있는지 확인
      if (userId) {
        const followingList = await userService
          .getFollowingAndFollowerData(userId)
          .then((data: IFollowerInfo) => data.followingUsers);

        let flag = false;
        followingList.forEach((user: IDifferentUser) => {
          if (user._id === postDetailData.writer.writerId) flag = true;
        });
        //follow 여부 state에 저장

        setIsFollowing(flag);
      }
    };
    fetchPostData();
  }, [id, userId]);

  // 팔로우 로직
  async function handleFollowClick() {
    const result = await userService.followingUser(postDetail.writer.writerId);

    if (result.response === true) {
      setIsFollowing(true);
    } else {
      alert("팔로우 실패");
    }
    console.log("followingUser result:", result);
  }

  async function handleUnfollowClick() {
    const result = await userService.deleteFollowingUser(
      postDetail.writer.writerId
    );
    if (result.response === true) {
      setIsFollowing(false);
    } else {
      alert("언팔로우 실패");
    }
    console.log("unfollow..", result);
  }

  //progress, opacity 등 동적으로 바뀌는 스타일
  const [opacity, setOpacity] = useState<number>(1);

  const getElementPostion = () => {
    const main = document.getElementById("mainPost");

    const scrollY = window.scrollY; // 스크롤 양

    const mainPosition =
      main && Math.floor(scrollY + main.getBoundingClientRect().top); // 절대위치, Math.floor로 정수로 변환

    //window.innerHeight + scrollY가 mainBottomPosition아래로 내려가면 -> progress bar width는 100%이상이 되어야 한다...

    setOpacity(
      mainPosition ? 1 - scrollY / mainPosition : 1 //스크롤양이 메인보다 많고 푸터보다 적을 때
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", getElementPostion); // 스크롤시 getBannerPosition 발생

    return () => window.removeEventListener("scroll", getElementPostion); // 클린업, 페이지를 나가면 이벤트 삭제
  }, []); // position 값이 변할 때마다 effect 실행

  const parsingDate = (): string => {
    const date = new Date(postDetail.writedAt);

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

  return (
    <div>
      <div className="w-[100vw] bg-[#000000b5] mmd:px-[18rem] px-[2rem] fixed top-0 z-[9] flex items-center h-[70vh]">
        <div style={{ opacity: `${opacity}` }}>
          <p className={`text-white text-5xl pb-[1rem]`}>{postDetail.title}</p>
          {postDetail.writer ? (
            <p className="text-white">{postDetail.writer.name}</p>
          ) : (
            <p>writer</p>
          )}
          <p className="text-white">{parsingDate()}</p>
        </div>
      </div>
      <div
        id="mainPost"
        className="bg-white mt-[2rem] mmd:px-[18rem] px-[2rem] mt-[70vh] z-[10] relative pb-[50vh]"
      >
        <PostContent
          scrap={scrap}
          setScrap={setScrap}
          outputData={postDetail.content}
          scrapingCount={postDetail.scrapingCount}
        />
        {postDetail.writer && (
          <div
            id="mainBottom"
            className="min-h-[150px] mmd:px-[18rem] px-[2rem] h-fit mb-[2rem] bg-[#ececec] absolute left-0 w-[100vw] px-[18rem] flex justify-between"
          >
            <div>
              <div className="flex pt-[3rem] gap-[1rem] text-lg">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate(`/my/${postDetail.writer.writerId}`)}
                >
                  {postDetail.writer.name}
                </p>
                {!isWriter &&
                  (isFollowing ? (
                    <button
                      onClick={handleUnfollowClick} // unFollowClick 함수로 수정
                      className="m-0 text-xs border-[1px] bg-red-500 text-gray-50 rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="m-0 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                      onClick={handleFollowClick}
                    >
                      Follow
                    </button>
                  ))}
              </div>
              <p className="pt-[1rem] pb-[2rem] text-gray-500 text-sm">
                조디한줄소개
              </p>
            </div>
            <div>
              <div
                style={{ backgroundImage: `url(${postDetail.writer.img})` }}
                className="w-[100px] h-[100px] rounded-full bg-cover bg-center relative top-[-20px] cursor-pointer"
                onClick={() => navigate(`/my/${postDetail.writer.writerId}`)}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
