// type Props = {}
import Post from "./component/Post";
import postAPI from "../../api/postDetailAPI";
import { useEffect, useState } from "react";
import { IoTrashBin } from "react-icons/io5";

const service = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

interface Preview {
  text: string;
  img: string;
  _id: string;
}

interface UserInfo {
  id: string;
  _id: string;
  nickname: string;
  profile: string;
}

export interface IPostInfo {
  id: string;
  preview: Preview;
  title: string;
  updatedAt: Date;
  writer: UserInfo;
  _id: string;
}

export default function ScrapPage() {
  const [post, setPostInfo] = useState<IPostInfo[]>([]);

  useEffect(() => {
    const fetchScrapList = async (): Promise<void> => {
      try {
        const data = await service.getScrapList();
        console.log(data.scrappedPosts);
        setPostInfo(data.scrappedPosts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScrapList();
  }, []);

  if(post.length ===0) {
    return <div className="w-fit mx-auto mt-[10rem] flex flex-col items-center gap-[2rem]">
        <IoTrashBin size={60} color="gray"/>
        <p>스크랩 한 post가 없습니다!</p>
    </div>
  }

  return (
    <div className="w-[65%] mx-auto mt-[8rem]">
      {post.map((post) => (
        <div key={post._id}>
          <Post postInfo={post} />
          <div className="h-[1px] w-full bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
