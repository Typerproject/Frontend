import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store";
import FollowList from "./component/FollowList";
import Post from "../../components/Post/Post";
import userAPI, { IFollowerInfo, IUserInfo } from "../../api/userAPI";
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
  //preview: object;
  preview: Pre;
  createdAt: string;
  public: boolean;
  scrapingCount: number;
  commentCount: number;
}

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [cuserInfo, setCuserInfo] = useState<IUserInfo | null>(null);
  const currentUser = useAppSelector((state) => state.user);
  const currentUserId = useAppSelector((state) => state.user._id);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfPage, setIsEndOfPage] = useState(false);
  const mainPostContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollY = useRef(0);

  useEffect(() => {
    if (currentUserId) {
      console.log("파라미터 잘 가져와 지나?", currentUserId);

      // 유저 정보 획득
      service
        .getUserInfo(currentUserId)
        .then((data) => {
          console.log("마이페이지 접근 유저", data);
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

  //게시글 미리보기
  const [previewPost, setPreviewPost] = useState<Preview[]>([]);

  useEffect(() => {
    if (page === 1) {
      // 첫 페이지 로드 시 초기화
      setPreviewPost([]);
      setIsEndOfPage(false);
    }

    if (userInfo?.writerdPost) {
      const tempPost: any = userInfo?.writerdPost.map((ele: Preview) => {
        return {
          title: ele.title,
          _id: ele._id,
          preview: ele.preview,
          createdAt: ele.createdAt,
          public: ele.public,
          scrapingCount: ele.scrapingCount,
          commentCount: ele.commentCount,
          isScrapped: ele.isScrapped,
        };
      });

      setPreviewPost(tempPost);
    }
  }, [userInfo]);

  const [followerInfo, setFollowerInfo] = useState<IFollowerInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // 상태 변경을 감지하기 위한 키
  const [follow, setFollow] = useState<State>(false);

  //현재 접속한 마이 페이지의 유저 아이디
  const { id } = useParams<{ id: string }>(); // useParams의 반환 타입을 명시

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
        console.log("닉넴 데이터", data);

        const user = {
          _id: currentUser._id || "",
          nickname: editedNickname || "",
          email: currentUser.email || null,
          comment: currentUser.comment || null,
          profile: currentUser.profile || null,
        };

        console.log("nick", user);

        dispatch(setUser({ user }));
      })
      .catch((err) => {
        console.error("닉 에러: ", err);
      });

    service
      .updateUserComment(editedComment)
      .then((data) => {
        console.log("comment: ", data);

        const user = {
          _id: currentUser._id || "",
          nickname: editedNickname || "",
          email: currentUser.email || null,
          comment: editedComment || null,
          profile: currentUser.profile || null,
        };

        console.log("--------", user);

        dispatch(setUser({ user }));
        // setEditedComment("");
        // setEditedNickname("");
      })
      .catch((err) => {
        console.error("comment 에러: ", err);
      });

    console.log("저장 버튼 클릭:", editedNickname, editedComment);
    setIsEditing(false);
  };

  // 취소 버튼 클릭 시 수정 모드 종료
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (id) {
      console.log("파라미터 잘 가져와 지나?", id);

      // 유저 정보 획득
      service
        .getUserInfo(id)
        .then((data) => {
          console.log("마이페이지 유저", data);
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("마이페이지 유저", err);
        });

      // 유저 팔로우 정보 획득
      service
        .getFollowingAndFollowerData(id)
        .then((data) => {
          console.log("마이페이지 팔로우", data);
          setFollowerInfo(data);

          const found = data.followerUsers.some(
            (user) => user._id === currentUser._id
          );

          console.log(found);

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
        console.log("followingUser result:", result);

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
        console.log("followerUser result:", result);

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

  //무한 스크롤

  const handleScroll = () => {
    const { current } = mainPostContainerRef;
    if (
      current &&
      current.scrollTop + current.clientHeight >= current.scrollHeight - 50 &&
      !isLoading &&
      !isEndOfPage // 스크롤이 맨 밑으로 내렸을 때만 처리
      // current.scrollTop > prevScrollY.current // 스크롤이 맨 밑으로 내렸을 때만 처리
    ) {
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
    prevScrollY.current = current ? current.scrollTop : 0; // 현재 스크롤 위치
  };

  useEffect(() => {
    const { current } = mainPostContainerRef;
    if (current) {
      current.addEventListener("scroll", handleScroll);
      return () => {
        current.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // 스크롤 맨 위로 올리는 함수
  const scrollToTop = () => {
    if (mainPostContainerRef.current) {
      mainPostContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // 페이지의 스크롤도 맨 위로 이동
  };

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
            {previewPost.map((post: Preview) => {
              return (
                <div>
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
          className="mmd:fixed grid place-items-center mmd:order-last mmd:col-span-1 mmd:place-items-start"
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

              <div className="content-center">
                <div className="flex gap-[1rem] items-center">
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

                  {/*버튼*/}
                  <div className="grid place-items-start">
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

                {/*팔로잉팔로워 수*/}
                {isEditing ? (
                  <div></div>
                ) : (
                  <div
                    className={`flex gap-5  mt-[0.5rem] text-[#b1b2b3] phone:text-sm`}
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
                  <p
                    style={{
                      fontFamily: "Ownglyph_Dailyokja-Rg, sans-serif",
                    }}
                    className="flex gap-10 text-[#88898a] mt-[0.7rem] w-[270px]"
                  >
                    {userInfo?.comment}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/*팔로잉팔로우*/}
          <div>
            {follow === "follower" && (
              <div>
                <div className="mt-[1rem] hidden mmd:block">
                  <p className="text-lg">Follower</p>
                  <ul className="space-y-4">
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
                  <ul className="space-y-4">
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
      {/* 스크롤 맨 위로 올려주는 버튼 */}
      <div className="relative w-full">
        <button
          onClick={scrollToTop}
          className="absolute bottom-0 right-0 mb-[1rem] mr-[2rem] bg-gray-900 text-gray-100 rounded-md hover:bg-gray-100 hover:text-gray-900 border-[1px] border-black duration-100"
        >
          <IoMdArrowDropup size={30} />
        </button>
      </div>
      <Footbar />
    </div>
  );
}
