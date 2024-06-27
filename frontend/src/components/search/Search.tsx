import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footbar from "../Footbar/Footbar";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function Search() {
  const [postdata, setPostdata] = useState<any[]>([]);
  const [writerdata, setWriterdata] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("글");
  const [post, setPost] = useState(true);
  const [writer, setWriter] = useState(false);
  const query = useQuery();
  const [searchtext, setSearchtext] = useState(query.get("text") || "");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfPage, setIsEndOfPage] = useState(false);
  const mainPostContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const { current } = mainPostContainerRef;
    if (current) {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 5 &&
        !isLoading &&
        !isEndOfPage
      ) {
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, isEndOfPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 1) {
          setPostdata([]);
          setWriterdata([]);
          setIsEndOfPage(false);
        }

        let response: any;
        if (post) {
          response = await axios.get(
            `${
              import.meta.env.VITE_SERVER_SEARCH_API_URI
            }?value=${searchtext}&page=${page}`
          );
          setTotalPage(response.data.total);

          const newWriterArray = response.data.new_array.map((item: any) => {
            if (item.preview.text.length > 50) {
              item.preview.text = item.preview.text.slice(0, 50) + "...";
            }
            return item;
          });

          setPostdata((prevPostList) => [...prevPostList, ...newWriterArray]);
        } else if (writer) {
          response = await axios.get(
            `${
              import.meta.env.VITE_SERVER_SEARCH_API_URI
            }/writer?value=${searchtext}&page=${page}`
          );

          const newWriterArray = response.data.new_array.map((item: any) => {
            if (item.comment.length > 50) {
              item.comment = item.comment.slice(0, 50) + "...";
            }
            return item;
          });

          setWriterdata((prevWriterList) => [
            ...prevWriterList,
            ...newWriterArray,
          ]);
          setTotalPage(response.data.total);
        }

        if (
          (post && response.data.new_array.length === 0) ||
          (writer && response.data.new_array.length === 0)
        ) {
          setIsEndOfPage(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (searchtext) {
      fetchData();
    }
  }, [page, searchtext, post, writer]);

  const handleSearchClick = () => {
    navigate(`/search?text=${searchtext}`);
    setPage(1); // 새로운 검색 시 페이지를 1로 초기화
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && searchtext.trim().length > 0) {
      handleSearchClick();
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPage(1); // 탭 변경 시 페이지를 1로 초기화
    if (tab === "글") {
      setPost(true);
      setWriter(false);
    } else {
      setPost(false);
      setWriter(true);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="py-[3rem] px-[2rem]">
        <div className="flex justify-center items-center py-12">
          <input
            className="w-full h-[3rem] shadow-sm p-[1rem] text-xl border rounded"
            //value={searchtext}
            onChange={(e) => setSearchtext(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=" 검색어를 입력해주세요."
          />
        </div>
        <div className="flex gap-[5px]">
          <Button
            onClick={() => handleTabClick("글")}
            className={`bg-white border-none hover:text-gray-500 ${
              activeTab === "글" ? "text-black" : "text-gray-500"
            }`}
          >
            글 검색
          </Button>
          <Button
            onClick={() => handleTabClick("작가")}
            className={`bg-white border-none hover:text-gray-500 ${
              activeTab === "작가" ? "text-black" : "text-gray-500"
            }`}
          >
            작가
          </Button>
        </div>
        <hr></hr>
        <div
          className="flex flex-col items-center mt-10 px-[0.75rem]"
          ref={mainPostContainerRef}
        >
          <div className="w-full">
            {post &&
              (postdata.length === 0 ? (
                <div className="text-center text-3xl">검색 결과가 없습니다</div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div>글 {totalpage}건</div>
                  {postdata.map((elem: any, idx) => (
                    <div key={idx}>
                      <Card
                        className="card border-none rounded-lg cursor-pointer h-[15rem] flex flex-row rounded hover:bg-gray-200"
                        onClick={() => navigate(`/post/${elem._id}`)}
                      >
                        <div className="flex flex-col p-4 w-2/3">
                          <div className="flex items-center mb-2">
                            <img
                              className="w-12 h-12 object-cover rounded-full mr-4"
                              src={elem.profile}
                              alt="Profile"
                            />
                            <div className="font-bold">{elem.nickname}</div>
                          </div>
                          <div
                            className="font-bold text-2xl mb-4 mt-2
                          max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {elem.title}
                          </div>
                          <div
                            className="text-gray-500
                          max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {elem.preview.text}
                          </div>
                        </div>
                        <img
                          className="w-1/3 h-auto object-cover rounded"
                          src={elem.preview.img}
                          alt="Preview"
                        />
                      </Card>
                      <hr className="mt-[2rem]" style={{ color: "gray" }}></hr>
                    </div>
                  ))}
                </div>
              ))}

            {writer &&
              (writerdata.length === 0 ? (
                <div className="text-center text-3xl">검색 결과가 없습니다</div>
              ) : (
                <div className="">
                  <div className="mb-[1rem]">작가 {writerdata.length}건</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {writerdata.map((elem: any, idx) => (
                      <div key={idx}>
                        <Card
                          className="card border rounded-lg cursor-pointer w-200 h-auto flex flex-col rounded hover:bg-gray-200"
                          onClick={() => navigate(`/my/${elem.userId}`)}
                        >
                          <div className="flex gap-[1rem] px-[0.5rem] py-[0.7rem] w-full mr-[1rem]">
                            <img
                              className="size-16 object-cover rounded-full"
                              src={elem.profile}
                              alt="Profile"
                            />

                            <div className="flex flex-col mr-[1rem]">
                              <div className="font-bold text-lg">
                                {elem.nickname}
                              </div>
                              <div className="mt-2 text-base max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap">
                                {elem.comment}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {isLoading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
}
