import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigator from "../../components/Navbar/Navbar";
import postAPI, { IPostListForMain, IPost } from "../../api/postDetailAPI";
import MainPost from "./component/Post";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

const MyComponent = () => {
  const [issue, setIssue] = useState<Array<Array<string>>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeButton, setActiveButton] = useState("HOT");
  const [page, setPage] = useState(1);
  const [postList, setPostList] = useState<IPostListForMain | null>(null);

  const handleClick = (buttonName: any) => {
    setActiveButton(buttonName);
    setPage(1);
  };

  useEffect(() => {
    const hi = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER_SHINHAN_API_URI
        );
        setIssue(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    hi();
  }, []);

  useEffect(() => {
    if (issue.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % issue.length);
      }, 5000); // 3초 간격

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [issue]);

  useEffect(() => {
    postService
      .getPostListForMain(page, activeButton.toLowerCase())
      .then((data) => {
        console.log("메인 페이지 포스트 데이터 잘 가져와 지나??", data);
        setPostList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page, activeButton]);

  return (
    <div>
      <Navigator />
      <div className="flex justify-center items-center mt-20">
        <div className="flex border rounded-md p-4">
          {issue.length > 0 && (
            <div
              key={currentIndex}
              className="flex flex-col justify-center w-120 h-12"
            >
              <div className="text-center font-bold">
                {issue[currentIndex][0]}
              </div>
              <div className="text-center">{issue[currentIndex][1]}</div>
              <div className="text-center">{issue[currentIndex][2]}</div>
            </div>
          )}
          <div
            className="absolute bottom-2 right-2 text-xs font-bold"
            style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
          >
            ◎ POWER BY SHINHAN SECURITIS API
          </div>
        </div>
      </div>

      <div className="flex ml-10 gap-5">
        <button
          className={`relative px-3 py-2 ${
            activeButton === "HOT"
              ? 'font-bold after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-black'
              : ""
          }`}
          onClick={() => handleClick("HOT")}
        >
          🔥HOT
        </button>
        <button
          className={`relative px-3 py-2 ${
            activeButton === "NEW"
              ? 'font-bold after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-black'
              : ""
          }`}
          onClick={() => handleClick("NEW")}
        >
          🎉NEW
        </button>
        <button
          className={`relative px-3 py-2 ${
            activeButton === "FOllOW"
              ? 'font-bold after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-black'
              : ""
          }`}
          onClick={() => handleClick("FOllOW")}
        >
          ❤️FOLLOW
        </button>
      </div>

      <div className="mt-10">
        {!postList || postList.posts.length === 0 ? (
          <div>no content</div>
        ) : (
          postList.posts.map((post: IPost) => <MainPost post={post} />)
        )}
      </div>
    </div>
  );
};

export default MyComponent;
