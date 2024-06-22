import Modal from "react-modal";
import FollowList from "./FollowList";
import userAPI, { IFollowerInfo, IUserInfo } from "../../api/userAPI";
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
      className="md:hidden fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
      overlayClassName="mmd:hidden fixed inset-0 bg-black bg-opacity-50"
    >
      <div>
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
          className="mt-4 p-2 bg-black text-white rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
