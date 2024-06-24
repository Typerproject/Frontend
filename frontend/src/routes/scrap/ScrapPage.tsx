// type Props = {}
import Post from "./component/Post";
import postAPI from "../../api/postDetailAPI";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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

interface IntersectionObserverInit {
  root?: Element | Document | null; //null시 뷰포트 자동으로 설정
  rootMargin?: string;
  threshold?: number | number[]; //target의 가시성이 얼마나 필요한지 백분율로 표시
}

export default function ScrapPage() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [page, setPage] = useState<number>(0);
  const [post, setPostInfo] = useState<IPostInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //타겟 요소의 관찰이 시작되거나, 가시성에 변화가 감지되면(threshold 와 만나면) 실행되는 callback
  //성능을 위해 useCallback hook으로 감싸주어야 한다고 vscode가 추천함
  const callback = useCallback(
    (
      entries: IntersectionObserverEntry[]
      // observer: IntersectionObserver
    ): void => {
      // 인스턴스가 생기면 타겟, 루트 교차 안 되어도 계속 실행됨...
      // 타겟 요소가 루트 요소와 교차하는 점이 없으면 콜백을 호출했으되, 조기에 탈출 (예외처리)
      const entry: IntersectionObserverEntry = entries[0];
      // entries.forEach((entry: IntersectionObserverEntry) => {
      //target지정 한개만 하니까 entries의 길이는 아마도 1
      //
      // if (entry.intersectionRatio <= 0) return;
      console.log(entry);
      if (isLoading) return;

      if (entry.isIntersecting) {
        fetchScrapList();
        // return setPage((prevPage) => prevPage + 1);
      }
      // });
    },
    [page]
  );

  const options = useMemo<IntersectionObserverInit>(
    () => ({
      root: null,
      rootMargin: "0px",
      threshold: 0,
    }),
    []
  );

  const fetchScrapList = async (): Promise<boolean> => {
    try {
      setIsLoading(true); // 데이터를 가져오는 중임을 나타내는 상태 설정
      const data = await service.getScrapList(page + 1);
      console.log('page', page);

      if (
        data.scrappedPosts.length === 0 &&
        observerRef.current &&
        targetRef.current
      ) {
        setIsLoading(false);
        observerRef.current.disconnect();
        console.log(data.scrappedPosts.length);
        // data.scrappedPosts = ["the end"];
        setPostInfo((prevData) => [...prevData, ...data.scrappedPosts]);
        return false;
        // observerRef.current.unobserve(targetRef.current);
      }

      if (data.scrappedPosts.length > 0) {
        console.log(data.scrappedPosts);
        setPage((prevPage) => prevPage + 1);
        setPostInfo((prevData) => [...prevData, ...data.scrappedPosts]);
        setIsLoading(false);
        return true;  // 데이터를 가져오는 작업 완료 후 상태 변경
      }
    } catch (error) {
      console.log(error);
    } 
    return false;
  };

  // useEffect(() => {
  //   if (isLoading === false) {
  //     setIsLoading(true);
  //     fetchScrapList();
  //   }
  // }, [page]);

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(callback, options);
    observerRef.current.observe(targetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [targetRef, options, callback]);

  if (post.length === 0) {
    return (
      <div className="w-fit mx-auto mt-[10rem] flex flex-col items-center gap-[2rem]">
        <IoTrashBin size={60} color="gray" />
        <p>스크랩 한 post가 없습니다!</p>
        <div id="observer" ref={targetRef}>
          observer!
        </div>
      </div>
    );
  }

  return (
    <div className="w-[65%] mx-auto mt-[8rem]">
      {post.map((post) => (
        <div key={post._id}>
          <Post postInfo={post} />
          <div className="h-[1px] w-full bg-gray-200"></div>
        </div>
      ))}
      {isLoading && <p>Loading...</p>}
      <div id="observer" ref={targetRef}>
      </div>
    </div>
  );
}
