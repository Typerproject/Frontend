import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store";
import FollowList from "./component/FollowList";
import Post from "../../components/Post/Post";
import userAPI, {
  IFollowerInfo,
  IUserInfo,
  IWritedPost,
} from "../../api/userAPI";
import { setUser } from "../../store/reducers/user";
import { useAppDispatch } from "../../store";
import Modal from "./component/Modal";
import { IoMdArrowDropup } from "react-icons/io";
import Footbar from "../../components/Footbar/Footbar";

type State = "follower" | "following" | false;

export interface Pre {
  text: string;
  img: string;
  _id: string;
}
interface Preview {
  title: string;
  _id: string;
  preview: Pre;
  createdAt: string;
  public: boolean;
  scrapingCount: number;
  isScrapped: boolean;
  commentCount: number;
}

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [cuserInfo, setCuserInfo] = useState<IUserInfo | null>(null);
  const currentUser = useAppSelector((state) => state.user);
  const currentUserId = useAppSelector((state) => state.user._id);
  const [previewPost, setPreviewPost] = useState<IWritedPost>({ posts: [] });
  //현재 접속한 마이 페이지의 유저 아이디
  const { id } = useParams<{ id: string }>(); // useParams의 반환 타입을 명시

  //무한 스크롤
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState(false);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isDone) {
        setPage((page) => page + 1);
      }
    },
    [isLoading, isDone]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    // 최하단 요소를 관찰 대상으로 지정
    const observerTarget = document.getElementById("observer");
    // 관찰 시작
    if (observerTarget) {
      observerRef.current.observe(observerTarget);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const fetchMorePosts = useCallback(
    () =>
      (async () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        if (page === 1) {
          setPreviewPost({ posts: [] });
        }
        try {
          setIsLoading(true);
          service.getWritedPost(id, page).then((data) => {
            setPreviewPost((prevPostList) => ({
              posts:
                page === 1
                  ? data.posts
                  : [...prevPostList.posts, ...data.posts],
            }));

            if (data.posts.length === 0) {
              setIsDone(() => true);
            }
            setIsLoading(false);
          });
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      })(),
    [page, id]
  );

  useEffect(() => {
    setPage(1);
  }, [id]);

  useEffect(() => {
    fetchMorePosts();
  }, [fetchMorePosts]);

  useEffect(() => {
    if (currentUserId) {
      // 유저 정보 획득
      service
        .getUserInfo(currentUserId)
        .then((data) => {
          setCuserInfo(data);
        })
        .catch((err) => {
          console.error("마이페이지 접근 유저", err);
        });

      console.log("ID 有", currentUserId);
    } else {
      console.log("ID 無", currentUserId);
    }
  }, [currentUser]);

  const [followerInfo, setFollowerInfo] = useState<IFollowerInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // 상태 변경을 감지하기 위한 키
  const [follow, setFollow] = useState<State>(false);

  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부를 관리하는 상태
  const [editedNickname, setEditedNickname] = useState(
    currentUser.nickname || ""
  ); // 수정된 닉네임을 관리하는 상태
  const [editedComment, setEditedComment] = useState(currentUser.comment || ""); // 수정된 코멘트를 관리하는 상태

  const [isFollowing, setIsFollowing] = useState(false);

  // Edit 버튼 클릭 시 수정 모드로 변경
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedNickname(currentUser.nickname || "");
    setEditedComment(currentUser.comment || "");
  };

  // 저장 버튼 클릭 시 수정 내용을 저장하고 수정 모드 종료
  const handleSaveClick = () => {
    service
      .modifyUserNickname(editedNickname)
      .then((data) => {
        const user = {
          _id: currentUser._id || "",
          nickname: editedNickname || "",
          email: currentUser.email || null,
          comment: currentUser.comment || null,
          profile: currentUser.profile || null,
        };

        dispatch(setUser({ user }));
      })
      .catch((err) => {
        console.error("닉 에러: ", err);
      });

    service
      .updateUserComment(editedComment)
      .then((data) => {
        const user = {
          _id: currentUser._id || "",
          nickname: editedNickname || "",
          email: currentUser.email || null,
          comment: editedComment || null,
          profile: currentUser.profile || null,
        };

        dispatch(setUser({ user }));
      })
      .catch((err) => {
        console.error("comment 에러: ", err);
      });

    setIsEditing(false);
  };

  // 취소 버튼 클릭 시 수정 모드 종료
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (id) {
      // 유저 정보 획득
      service
        .getUserInfo(id)
        .then((data) => {
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("마이페이지 유저", err);
        });

      // 유저 팔로우 정보 획득
      service
        .getFollowingAndFollowerData(id)
        .then((data) => {
          setFollowerInfo(data);

          const found = data.followerUsers.some(
            (user) => user._id === currentUser._id
          );

          if (found) {
            setIsFollowing(true);
          } else {
            setIsFollowing(found);
          }
        })
        .catch((err) => {
          console.error("마이페이지 팔로우", err);
        });

      console.log("ID 有", currentUser);
    } else {
      console.log("ID 無", currentUser);
    }
  }, [currentUser, id, isFollowing, refreshKey, isEditing]);

  const handleFollowerBtn = () => {
    if (follow != "follower") {
      setFollow("follower");
    } else {
      setFollow(false);
    }
  };

  const handleFollowingBtn = () => {
    if (follow != "following") {
      setFollow("following");
    } else {
      setFollow(false);
    }
  };

  useEffect(() => {
    setFollow(false);
  }, [id]);

  // 팔로잉 핸들러
  const handleFollowClick = () => {
    if (!id) {
      console.error("유효한 사용자 ID가 없습니다.");
      return;
    }

    // 팔로잉 요청 보내기
    service
      .followingUser(id)
      .then((result) => {
        // 팔로우가 성공했을 때만 상태 업데이트
        if (result.response && currentUser && followerInfo) {
          // 이미 팔로잉 중이 아닌 경우에만 추가
          const isAlreadyFollowing = followerInfo.followerUsers.some(
            (user) => user._id === currentUser._id
          );
          if (!isAlreadyFollowing) {
            // 새로운 팔로워 정보 추가
            const newFollower = {
              _id: currentUser._id || "",
              nickname: currentUser.nickname || "",
              profile: currentUser.profile || "",
            };

            // followerInfo 업데이트
            setFollowerInfo({
              ...followerInfo,
              followerUsers: [...followerInfo.followerUsers, newFollower],
              followerCount: followerInfo.followerCount + 1,
            });

            setIsFollowing(true);
          } else {
            console.log("이미 팔로우한 사용자입니다.");
          }
        } else {
          console.log("팔로우 요청이 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("팔로우 요청 중 오류 발생:", error);
      });
  };

  // 언팔로잉 버튼 핸들러
  const handleUnfollowClick = () => {
    if (!id) {
      console.error("유효한 사용자 ID가 없습니다.(언팔)");
      return;
    }

    service
      .deleteFollowingUser(id)
      .then((result) => {
        if (result.response && currentUser && followerInfo) {
          const isAlreadyFollowing = followerInfo.followerUsers.some(
            (user) => user._id === currentUser._id
          );

          // 있으면 제거
          if (isAlreadyFollowing) {
            const updatedFollowerUsers = followerInfo.followerUsers.filter(
              (user) => user._id !== id
            );

            // followerInfo 업데이트
            setFollowerInfo({
              ...followerInfo,
              followerUsers: updatedFollowerUsers,
              followerCount: followerInfo.followerCount - 1,
            });

            setIsFollowing(false);
          } else {
            console.log("이미 언팔로우한 사용자입니다.");
          }
        } else {
          console.log("언팔로우 요청이 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("언팔 오류지롱: ", err);
      });
  };

  //프로필 효과
  const [flipped, setFlipped] = useState(false);

  const handleFlipped = () => {
    setFlipped(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipped(true);
    }, 1000); // 페이지가 로드된 후 1초 뒤에 애니메이션 시작

    return () => clearTimeout(timer);
  }, [flipped]);

  //팔로우 스크롤 감지
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (contentRef.current && footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        const contentTop = contentRef.current.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const newMaxHeight = footerTop - contentTop - 20; // Adjust 20px for padding/margin
        setMaxHeight(newMaxHeight);
      }
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    handleResizeOrScroll(); // Initial call to set the maxHeight

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [follow]);

  return (
    <div className="mt-[7rem] phone:mt-[5rem] flex flex-col min-h-[calc(100vh-76.5px)]">
      <div className="mmd:grid mmd:grid-cols-4 flex flex-col flex-grow">
        {/*글목록*/}
        <div className="order-last mmd:col-span-3 text-5xl flex flex-col items-center gap-[2rem]">
          <p className="tracking-wide font-medium hidden mmd:block mmd:py-[2rem]">
            {userInfo?.nickname}'s Typer
          </p>
          <hr
            style={{ width: "82%", borderWidth: "2px", color: "#080808" }}
          ></hr>

          <div className="w-3/4">
            {/*가져온 글 목록을 map돌면서 출력*/}
            {previewPost.posts.map((post: Preview) => {
              return (
                <div key={post._id}>
                  {/*주인의 아이디와 profile*/}
                  <Post
                    id={id}
                    nickname={userInfo?.nickname}
                    profile={userInfo?.profile}
                    post={post}
                  />
                  <hr
                    style={{
                      width: "100%",
                      borderWidth: "2px",
                      color: "#ababab",
                    }}
                  ></hr>
                </div>
              );
            })}
          </div>
        </div>

        {/*프로필*/}
        <div
          style={{
            right: "7%",
          }}
          className=" mmd:fixed grid place-items-center mmd:order-last mmd:col-span-1 mmd:place-items-start"
        >
          <div className="mmd:flex-col">
            <div className="flex phone:flex-col pt-[2rem] pb-[3rem] mmd:py-[1rem] phone:px-[2rem] gap-[3.5rem] phone:gap-[0.2rem] mmd:flex-col mmd:gap-[1rem]">
              <div className="phone:flex phone:justify-center">
                <div
                  onMouseOver={handleFlipped}
                  className={`mmd:w-[96px] phone:w-24
                  ${
                    flipped
                      ? "animate-flip-back-front"
                      : "animate-flip-front-back"
                  }`}
                >
                  <img
                    className="size-32 mmd:size-24 phone:size-24 rounded-full"
                    src={userInfo?.profile}
                  />
                </div>
              </div>

              <div className="phone:mt-[1rem] content-center">
                <div className="flex flex-col gap-[0.5rem] phone:items-center phone:justify-center">
                  {/* 닉네임 */}
                  {isEditing ? (
                    <input
                      className="bg-gray-50 shadow-md rounded px-8 pt-6 pb-8 text-base mt-2 text-color text-blue-500 italic p-2  h-10"
                      type="text"
                      value={editedNickname}
                      onChange={(e) => setEditedNickname(e.target.value)}
                    />
                  ) : (
                    <p className="text-3xl phone:text-xl">
                      {userInfo?.nickname}
                    </p>
                  )}

                  {/*팔로잉팔로워 수*/}
                  {isEditing ? (
                    <div></div>
                  ) : (
                    <div
                      className={`flex gap-[1rem]  mt-[0.5rem] text-[#b1b2b3]  phone:justify-center phone:text-sm phone:py-[0.2rem]`}
                    >
                      <div className="relative">
                        <span
                          onClick={handleFollowerBtn}
                          className={`hover:text-[#141414] cursor-pointer  ${
                            follow === "follower"
                              ? "text-[#141414]"
                              : "text-[#b1b2b3]"
                          }`}
                        >
                          {followerInfo?.followerCount} followers
                        </span>
                      </div>

                      <div className="relative">
                        <span
                          onClick={handleFollowingBtn}
                          className={`hover:text-[#141414] cursor-pointer ${
                            follow === "following"
                              ? "text-[#141414]"
                              : "text-[#b1b2b3]"
                          }`}
                        >
                          {followerInfo?.followingCount} following
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 코멘트 */}
                  {isEditing ? (
                    <textarea
                      className="flex gap-10 text-[#88898a] text-blue-500 border-none italic w-54
                shadow-md rounded px-8 pt-6 pb-8 bg-gray-50 
                text-base mt-2 text-color text-blue-500 italic p-2 h-10"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                  ) : (
                    <div className="flex gap-10 text-[#88898a] w-64 phone:justify-center">
                      <p className="break-words">{userInfo?.comment}</p>
                    </div>
                  )}

                  {/*버튼*/}
                  <div className="grid place-items-start ">
                    {currentUser._id === id && isEditing ? (
                      <div className="flex gap-10 ">
                        <button
                          onClick={handleSaveClick}
                          className="text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : currentUser._id === id ? (
                      <button
                        onClick={handleEditClick}
                        className="text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                      >
                        Edit
                      </button>
                    ) : isFollowing ? (
                      <button
                        onClick={handleUnfollowClick} // unFollowClick 함수로 수정
                        className="text-xs border-[1px] bg-red-500 text-gray-50 rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowClick}
                        className="text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*팔로잉팔로우*/}
          <div>
            {follow === "follower" && (
              <div>
                <div className="mt-[1rem] hidden mmd:block">
                  <p className="text-lg">Follower</p>
                  <div
                    ref={contentRef}
                    className="overflow-y-auto pt-3 w-[15rem]"
                    style={{ maxHeight: maxHeight ? `${maxHeight}px` : "auto" }}
                  >
                    <ul className="space-y-4 w-[12rem]">
                      {followerInfo?.followerUsers.map((user) => (
                        <FollowList
                          _id={user._id}
                          nickname={user.nickname}
                          profile={user.profile}
                          which={follow}
                          setRefreshKey={setRefreshKey}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <Modal
                    followList={followerInfo?.followerUsers}
                    which={follow}
                    setRefreshKey={setRefreshKey}
                    handleClose={handleFollowerBtn}
                  />
                </div>
              </div>
            )}
            {follow === "following" && (
              <div>
                <div className="mt-[1rem] hidden mmd:block">
                  <p className="text-lg">Following</p>
                  <div
                    ref={contentRef}
                    className="overflow-y-auto pt-3 w-[15rem]"
                    style={{ maxHeight: maxHeight ? `${maxHeight}px` : "auto" }}
                  >
                    <ul className="space-y-4 w-[12rem] ">
                      {followerInfo?.followingUsers.map((user) => (
                        <FollowList
                          _id={user._id}
                          nickname={user.nickname}
                          profile={user.profile}
                          which={follow}
                          setRefreshKey={setRefreshKey}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <Modal
                    followList={followerInfo?.followingUsers}
                    which={follow}
                    setRefreshKey={setRefreshKey}
                    handleClose={handleFollowingBtn}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <>loading..</>
      ) : (
        <div id="observer" style={{ height: "10px" }}></div>
      )}

      <div ref={footerRef}>
        <Footbar />
      </div>
    </div>
  );
}
