// import React from 'react'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store";
import FollowList from "./component/FollowList";
import Post from "../../components/Post/Post";
import userAPI, { IFollowerInfo, IUserInfo } from "../../api/userAPI";
import { setUser } from "../../store/reducers/user";
import { useAppDispatch } from "../../store";

// type Props = {}

type State = "follower" | "following" | false;

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function MyPage() {
  // const [userName, setUserName] = useState<string>();
  // const [profileImg, setProfileImg] = useState<string>();
  // const [profileIntro, setProfileIntro] = useState<string>();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  // const [followerCount, setFollowerCount] = useState<number>();
  // const [followingCount, setFollowingCount] = useState<number>();
  const [followerInfo, setFollowerInfo] = useState<IFollowerInfo | null>(null);

  const [follow, setFollow] = useState<State>(false);

  //현재 접속한 마이 페이지의 유저 아이디
  const { id } = useParams<{ id: string }>(); // useParams의 반환 타입을 명시
  //console.log(id);

  const currentUser = useAppSelector((state) => state.user);

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

        dispatch(setUser({ user }));
        setEditedComment("");
        setEditedNickname("");
      })
      .catch((err) => {
        console.error("comment 에러: ", err);
      });

    console.log("저장 버튼 클릭:", editedNickname, editedComment);
    // 상태를 업데이트하고 수정 모드를 종료
    // setEditedNickname(editedNickname); // 필요 시 서버와 통신 후 업데이트
    // setEditedComment(editedComment);   // 필요 시 서버와 통신 후 업데이트
    setIsEditing(false);
  };

  // 취소 버튼 클릭 시 수정 모드 종료
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (id) {
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
        })
        .catch((err) => {
          console.error("마페 팔로우", err);
        });

      if (followerInfo?.followerUsers) {
        const found = followerInfo.followerUsers.some(
          (user) => user._id === currentUser._id
        );
        setIsFollowing(found);
      }

      console.log("아디 잇으면", currentUser);
    } else {
      console.log("아디 없으면", currentUser);
    }
  }, [currentUser, id]);

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

  const handleFollowClick = () => {
    if (!id) {
      console.error("유효한 사용자 ID가 없습니다.");
      return;
    }

    // 팔로우 요청 보내기
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

  return (
    <div className="mt-[7rem]">
      <div className="grid grid-cols-3">
        {/*글목록*/}
        <div className="col-span-2 text-5xl flex flex-col items-center gap-[2rem]">
          <p>{userInfo?.nickname}'s Typer</p>
          <div>
            {/*가져온 글 목록을 map돌면서 출력*/}
            <Post />
            <Post />
          </div>
        </div>

        {/*프로필*/}
        <div className="col-span-1">
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
                className="flex gap-10 text-[#88898a] text-blue-500 border-none italic w-full
                shadow-md rounded px-8 pt-6 pb-8 bg-gray-50
                text-base mt-2 text-color text-blue-500 italic p-2  h-10"
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
                  className="text-xs border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="text-xs border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                >
                  Cancel
                </button>
              </div>
            ) : currentUser._id === id ? (
              isFollowing ? (
                <button
                  // onClick={handleUnfollowClick} // unFollowClick 함수로 수정
                  className="text-xs mt-[0.7rem] border-[1px] bg-red-500 text-white rounded-full border-red-500 text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-red-500 duration-300"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="text-xs mt-[0.7rem] border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
                >
                  Edit
                </button>
              )
            ) : (
              <button
                onClick={handleFollowClick}
                className="text-xs mt-[0.7rem] border-[1px] bg-black text-white rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
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
                        userId={user._id}
                        userName={user.nickname}
                        profileImg={user.profile}
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
                        userId={user._id}
                        userName={user.nickname}
                        profileImg={user.profile}
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
