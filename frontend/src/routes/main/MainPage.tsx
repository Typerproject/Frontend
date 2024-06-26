import { useState, useEffect, useRef } from "react";
import Navigator from "../../components/Navbar/Navbar";
import postAPI, { IPostListForMain, IPost } from "../../api/postDetailAPI";
import MainPost from "./component/Post";
//import { useAppSelector } from "../../store";
import PostLoading from "./component/PostLoading";
import { IoMdArrowDropup } from "react-icons/io";
import Footbar from "../../components/Footbar/Footbar";
import SliderTest from "./component/SliderTest";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

const MyComponent = () => {
  const [activeButton, setActiveButton] = useState("Hot");
  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState<IPostListForMain>({ posts: [] });

  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfPage, setIsEndOfPage] = useState(false);

  //const currentUser = useAppSelector((state) => state.user);

  const mainPostContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollY = useRef(0);

  const handleClick = (buttonName: string) => {
    if (activeButton !== buttonName) {
      // 현재 버튼이 클릭된 버튼과 같지 않을 때만 페이지 초기화
      setActiveButton(buttonName);
      setPage(1);
      setIsEndOfPage(false);
      setIsLoading(true);
    }
  };

  const handleScroll = () => {
    const { current } = mainPostContainerRef;
    if (
      current &&
      current.scrollTop + current.clientHeight >= current.scrollHeight - 50 &&
      !isLoading &&
      !isEndOfPage // 스크롤이 맨 밑으로 내렸을 때만 처리
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

  useEffect(() => {
    if (page === 1) {
      // 첫 페이지 로드 시 초기화
      setPostList({ posts: [] });
      setIsEndOfPage(false);
    }

    postService
      .getPostListForMain(page, activeButton.toLowerCase())
      .then((data) => {
        setPostList((prevPostList) => ({
          ...prevPostList,
          posts:
            page === 1 ? data.posts : [...prevPostList.posts, ...data.posts],
        }));

        setIsLoading(false);

        if (data.posts.length === 0) {
          setIsEndOfPage(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page, activeButton]);

  // 스크롤 맨 위로 올리는 함수
  const scrollToTop = () => {
    if (mainPostContainerRef.current) {
      mainPostContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // 페이지의 스크롤도 맨 위로 이동
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Navigator />

      <div className="mt-[77px]">
        <SliderTest />
      </div>

      <div className="flex-grow">
        <div className="mt-[45px] flex flex-col">
          <div className="flex flex-row x-[276px] h-[55px] mt-14 ml-[3rem] phone:mr-[3rem] phone:justify-center">
            <button
              onClick={() => handleClick("Hot")}
              className={`w-[72px] text-[23px] border-b-4 ${
                activeButton === "Hot" ? `border-gray-900` : `text-gray-400`
              }`}
            >
              Hot
            </button>
            <button
              onClick={() => handleClick("New")}
              className={`w-[80px] text-[23px] border-b-4 ${
                activeButton === "New" ? `border-gray-900` : `text-gray-400`
              }`}
            >
              New
            </button>
            <button
              onClick={() => handleClick("Follow")}
              className={`w-[102px] text-[23px] border-b-4 ${
                activeButton === "Follow" ? `border-gray-900` : `text-gray-400`
              }`}
            >
              Follow
            </button>
          </div>

          <div className="px-[10px] my-10">
            <div
              className="min-h-[500px] max-h-[800px] overflow-y-auto"
              ref={mainPostContainerRef}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {!postList || (postList.posts.length === 0 && isLoading) ? (
                <div>No content</div>
              ) : postList.posts.length === 0 ? (
                <div>
                  <PostLoading />
                  <PostLoading />
                  <PostLoading />
                </div>
              ) : (
                postList.posts.map((post: IPost) => <MainPost post={post} />)
              )}
            </div>
            {/* 스크롤 맨 위로 올려주는 버튼 */}
            <div className="flex justify-end w-full">
              <button
                onClick={scrollToTop}
                className="flex mt-4 bg-gray-900 text-gray-100 rounded-md hover:bg-gray-100 hover:text-gray-900 border-[1px] border-black duration-100"
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
