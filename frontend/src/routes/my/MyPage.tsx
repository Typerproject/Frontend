// import React from 'react'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store";
import FollowList from "./component/FollowList";
import Post from "../../components/Post/Post";
import userAPI, { IFollowerInfo, IUserInfo } from "../../api/userAPI";
import { setUser, logoutUser } from "../../store/reducers/user";
import { useAppDispatch } from "../../store";

// type Props = {}

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
}

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  //게시글 미리보기
  const [previewPost, setPreviewPost] = useState<Preview[]>([]);

  useEffect(() => {
    if (userInfo?.writerdPost) {
      const tempPost: any = userInfo?.writerdPost.map((ele: Preview) => {
        return {
          title: ele.title,
          _id: ele._id,
          preview: ele.preview,
          createdAt: ele.createdAt,
          public: ele.public,
          scrapingCount: ele.scrapingCount,
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

  const currentUser = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부를 관리하는 상태
  const [editedNickname, setEditedNickname] = useState(
    currentUser.nickname || ""
  ); // 수정된 닉네임을 관리하는 상태
  const [editedComment, setEditedComment] = useState(currentUser.comment || ""); // 수정된 코멘트를 관리하는 상태

  const [isFollowing, setIsFollowing] = useState(false);

  // const navigate = useNavigate();

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

        dispatch(setUser({ user }));
        setEditedComment("");
        setEditedNickname("");
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

      // 유저 정보 겟또다제
      service
        .getUserInfo(id)
        .then((data) => {
          console.log("마페 유저", data);
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("마페 유저", err);
        });

      // 유저 팔로우 정보 겟또다제
      service
        .getFollowingAndFollowerData(id)
        .then((data) => {
          console.log("마페 팔로우", data);
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
          console.error("마페 팔로우", err);
        });

      console.log("아디 잇으면", currentUser);
    } else {
      console.log("아디 없으면", currentUser);
    }
  }, [currentUser, id, isFollowing, refreshKey]);

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

  return (
    <div className="mt-[7rem]">
      <div className="grid grid-cols-4">
        {/*글목록*/}
        <div className="col-span-3 text-5xl flex flex-col items-center gap-[2rem]">
          <p>{userInfo?.nickname}'s Typer</p>
          <div className="w-3/4">
            {/*가져온 글 목록을 map돌면서 출력*/}
            {previewPost.map((post: Preview) => (
              <Post id={id} post={post} />
            ))}
          </div>
        </div>

        {/*프로필*/}
        <div className="col-span-1">
          {/* <button onClick={handleLogout}>로그아웃</button> */}
          <div>
            <img className="size-24 rounded-full" src={userInfo?.profile} />
            {/* 닉네임 */}
            {isEditing ? (
              <input
                className="bg-gray-50 shadow-md rounded px-8 pt-6 pb-8
                text-base mt-2 text-color text-blue-500 italic p-2  h-10"
                type="text"
                value={editedNickname}
                onChange={(e) => setEditedNickname(e.target.value)}
              />
            ) : (
              <p className="text-3xl mt-[0.7rem]">{userInfo?.nickname}</p>
            )}

            {/*팔로잉팔로워 수*/}
            {isEditing ? (
              <div></div>
            ) : (
              <div className={`flex gap-5  mt-[0.5rem] text-[#b1b2b3]`}>
                <span
                  onClick={handleFollowerBtn}
                  className={`hover:text-[#141414] cursor-pointer  ${
                    follow === "follower" ? "text-[#141414]" : "text-[#b1b2b3]"
                  }`}
                >
                  {followerInfo?.followerCount} followers
                </span>
                <span
                  onClick={handleFollowingBtn}
                  className={`hover:text-[#141414] cursor-pointer ${
                    follow === "following" ? "text-[#141414]" : "text-[#b1b2b3]"
                  }`}
                >
                  {followerInfo?.followingCount} following
                </span>
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
              <p className="flex gap-10 text-[#88898a] mt-[0.7rem]">
                {userInfo?.comment}
              </p>
            )}

            {currentUser._id === id && isEditing ? (
              <div className="flex gap-10 mt-[0.7rem]">
                <button
                  onClick={handleSaveClick}
                  className="text-xs mt-[0.7rem] border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="text-xs mt-[0.7rem] border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                >
                  Cancel
                </button>
              </div>
            ) : currentUser._id === id ? (
              <button
                onClick={handleEditClick}
                className="text-xs mt-[0.7rem] border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
              >
                Edit
              </button>
            ) : isFollowing ? (
              <button
                onClick={handleUnfollowClick} // unFollowClick 함수로 수정
                className="text-xs mt-[0.7rem] border-[1px] bg-red-500 text-gray-50 rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollowClick}
                className="text-xs mt-[0.7rem] border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
              >
                Follow
              </button>
            )}
          </div>

          {/*팔로잉팔로우*/}
          <div>
            {follow === "follower" && (
              <div>
                <div className="mt-[3rem]">
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
              </div>
            )}
            {follow === "following" && (
              <div>
                <div className="mt-[3rem]">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
