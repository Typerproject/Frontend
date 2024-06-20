// type Props = {}
import Post from "./component/Post";
import postAPI from "../../api/postDetailAPI";
import { useEffect, useState } from "react";

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

  return (
    <div className="w-[65%] mx-auto mt-[8rem]">
      {post.map((post) => (
        <>
          <Post key={post._id} postInfo={post} />
          <div className="h-[1px] w-full bg-gray-200"></div>
        </>
      ))}
    </div>
  );
}
