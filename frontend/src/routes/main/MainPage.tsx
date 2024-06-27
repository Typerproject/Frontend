import { useState, useEffect, useRef, useCallback } from "react";
import postAPI, { IPostListForMain, IPost } from "../../api/postDetailAPI";
import MainPost from "./component/Post";
import PostLoading from "./component/PostLoading";
import { IoMdArrowDropup } from "react-icons/io";
import Footbar from "../../components/Footbar/Footbar";
import SliderTest from "./component/SliderTest";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

const MyComponent = () => {
  const [activeButton, setActiveButton] = useState<string>("Hot");
  const [page, setPage] = useState<number>(1);
  const [postList, setPostList] = useState<IPostListForMain>({ posts: [] });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const targetRef = useRef<HTMLDivElement | null>(null); // 무한 스크롤 감지를 위한 마지막 요소의 참조를 저장
  const observerRef = useRef<IntersectionObserver | null>(null); //Intersection Observer 객체 저장

  const fetchPostList = useCallback(async (): Promise<void> => {
    try {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      setIsLoading(true);
      const data = await postService.getPostListForMain(
        page,
        activeButton.toLowerCase()
      );
      if (page === 1) {
        setPostList({ posts: data.posts });
      } else {
        setPostList((prevPostList) => ({
          posts: [...prevPostList.posts, ...data.posts],
        }));
      }

      if (data.posts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [activeButton, page]);

  useEffect(() => {
    fetchPostList();
  }, [fetchPostList]);

  const callback = useCallback(
    // IntersectionObserver를 사용하여 targetRef가 화면에 보이는지 감지
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (targetRef.current) {
      observerRef.current = new IntersectionObserver(callback, {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      });
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  const handleClick = (buttonName: string) => {
    if (activeButton !== buttonName) {
      // 현재 버튼이 클릭된 버튼과 같지 않을 때만 페이지 초기화
      setActiveButton(buttonName);
      setPage(1);
      setPostList({ posts: [] });
      setIsLoading(true);
    }
  };

  // 스크롤 맨 위로 올리는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // 페이지의 스크롤도 맨 위로 이동
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <div className="mt-[77px]">
        <SliderTest />
      </div>

      <div className="flex-grow">
        <div className="mt-[45px] flex flex-col">
          <div className="flex flex-row x-[276px] h-[55px] mt-14 px-[2.8rem] phone:justify-center">
            <button
              onClick={() => handleClick("Hot")}
              className={`w-[72px] text-[23px] border-b-4 ${
                activeButton === "Hot"
                  ? `border-gray-900`
                  : `text-gray-400 hover:bg-gray-200 hover:text-gray-700 duration-200`
              }`}
            >
              Hot
            </button>
            <button
              onClick={() => handleClick("New")}
              className={`w-[80px] text-[23px] border-b-4 ${
                activeButton === "New"
                  ? `border-gray-900`
                  : `text-gray-400 hover:bg-gray-200 hover:text-gray-700 duration-200`
              }`}
            >
              New
            </button>
            <button
              onClick={() => handleClick("Follow")}
              className={`w-[102px] text-[23px] border-b-4 ${
                activeButton === "Follow"
                  ? `border-gray-900`
                  : `text-gray-400 hover:bg-gray-200 hover:text-gray-700 duration-200`
              }`}
            >
              Follow
            </button>
          </div>

          <div className="py-[20px]">
            <div>
              {!postList || (postList.posts.length === 0 && isLoading) ? (
                <div>
                  <PostLoading />
                  <PostLoading />
                  <PostLoading />
                </div>
              ) : postList.posts.length === 0 ? (
                <div className="text-center mt-8">게시글이 없습니다!</div>
              ) : (
                <>
                  {postList.posts.map((post: IPost) => (
                    <>
                      <MainPost post={post} />
                      <div
                        style={{
                          width: "100%",
                        }}
                        className="h-0.5 bg-gray-200 mb-4"
                      />
                    </>
                  ))}
                  <div ref={targetRef} className="h-1" />
                </>
              )}
            </div>
            <div className="flex justify-end w-full">
              <button
                onClick={scrollToTop}
                className="flex mt-4 mr-4 bg-gray-900 text-gray-100 rounded-md hover:bg-gray-100 hover:text-gray-900 border-[1px] border-black duration-100"
              >
                <IoMdArrowDropup size={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footbar />
    </div>
  );
};

export default MyComponent;
