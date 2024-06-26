import Modal from "react-modal";
import FollowList from "./FollowList";
//import userAPI, { IFollowerInfo, IUserInfo } from "../../api/userAPI";
import { useState } from "react";

type State = "follower" | "following" | false;

export interface IDifferentUser {
  _id: string;
  nickname: string;
  profile: string;
}

interface ModalProps {
  followList: IDifferentUser[] | undefined;
  which: State;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
}

export default function MyModal({
  followList,
  which,
  setRefreshKey,
  handleClose,
}: ModalProps) {
  const [open, setOpen] = useState(true);

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => (setOpen(false), handleClose())}
      className="absolute top-1/2 left-1/2 w-90 h-45 z-150 transform -translate-x-1/2 -translate-y-1/2 
      bg-white rounded-xl shadow-md flex justify-center overflow-auto
      py-[1rem] px-[1.5rem]"
      overlayClassName="mmd:hidden bg-black bg-opacity-50 fixed w-full h-screen top-0 left-0 z-10 inset-0"
    >
      <div>
        <div>{which}</div>
        <ul className="space-y-4">
          {followList.map((user) => (
            <FollowList
              _id={user._id}
              nickname={user.nickname}
              profile={user.profile}
              which={which}
              setRefreshKey={setRefreshKey}
            />
          ))}
        </ul>
        <button
          onClick={() => (setOpen(false), handleClose())}
          className="mt-4 text-xs border-[1px] bg-gray-900 text-gray-50 rounded-full border-black text-sm px-[0.7rem] py-[0.3rem] hover:bg-white hover:text-black duration-300"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
