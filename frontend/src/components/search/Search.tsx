import { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const [postdata, setPostdata] = useState<any[]>([]);
  const [writerdata, setWriterdata] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('글'); 
  const [post, setPost] = useState(true);
  const [writer, setWriter] = useState(false);
  const query = useQuery();
  const [searchtext, setSearchtext] = useState(query.get('text') || '');
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
        console.log('Loading more content...');
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
        console.log(page)
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
          response = await axios.get(`${import.meta.env.VITE_SERVER_SEARCH_API_URI}?value=${searchtext}&page=${page}`);
          setTotalPage(response.data.total);

          setPostdata((prevPostList) => 
            [...prevPostList, ...response.data.new_array]
          );
        } else if (writer) {
          response = await axios.get(`${import.meta.env.VITE_SERVER_SEARCH_API_URI}/writer?value=${searchtext}&page=${page}`);
          setWriterdata((prevWriterList) => [
            ...prevWriterList,
            ...response.data.new_array
          ]);
          setTotalPage(response.data.total);
        }

        if ((post && response.data.new_array.length === 0) || (writer && response.data.new_array.length === 0)) {
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
    if (e.key === 'Enter' && searchtext.trim().length > 0) {
      handleSearchClick();
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPage(1); // 탭 변경 시 페이지를 1로 초기화
    if (tab === '글') {
      setPost(true);
      setWriter(false);
    } else {
      setPost(false);
      setWriter(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <div className="flex justify-center items-center mt-12">
          <input
            className="w-[900px] h-[50px] pl-[10px] pr-[10px] py-[5px] bg-white text-2xl border-none rounded-l"
            value={searchtext}
            onChange={(e) => setSearchtext(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력해주세요"
          />
        </div>
        <div className="flex gap-[5px] mt-10 ml-[260px]">
          <Button
            onClick={() => handleTabClick('글')}
            className={`py-2 px-4 bg-white border-none ${activeTab === '글' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            글 검색
          </Button>
          <Button
            onClick={() => handleTabClick('작가')}
            className={`py-2 px-4 bg-white border-none ${activeTab === '작가' ? 'text-blue-500' : 'text-gray-500'}`}
          >
            작가
          </Button>
        </div>
        <div className="w-[900px] border-b-2 border-gray-200 ml-[280px] mt-2 mb-6 mr-6"></div>
        <div className="flex flex-col items-center mt-10" ref={mainPostContainerRef} >
          <div className="w-full max-w-4xl "  >
            
            {post && (
              postdata.length === 0 ? (
                <div className="text-center text-3xl">검색 결과가 없습니다</div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div>글 {totalpage}건</div>
                  {postdata.map((elem: any, idx) => (
                    <div key={idx}>
                      <Card
                        className="card border rounded-lg cursor-pointer h-60 flex flex-row"
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
                          <div className="font-bold text-xl mb-4 mt-2">{elem.title}</div>
                          <div className="text-gray-800">{elem.preview.text}</div>
                        </div>
                        <img
                          className="w-1/3 h-auto object-cover"
                          src={elem.preview.img}
                          alt="Preview"
                        />
                      </Card>
                      <div className="border-b border-gray-200 mt-2"></div>
                    </div>
                  ))}
                </div>
              )
            )}
            
            {writer && (
              writerdata.length === 0 ? (
                <div className="text-center text-3xl">검색 결과가 없습니다</div>
              ) : (
                <div className="container mx-auto">
                  <div className="mb-4">작가 {writerdata.length}건</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {writerdata.map((elem: any, idx) => (
                      <div key={idx}>
                        <Card
                          className="card border rounded-lg cursor-pointer w-200 h-60 flex flex-col"
                          onClick={() => navigate(`/my/${elem.userId}`)}
                        >
                          <div className="flex flex-col p-4 w-full">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex flex-col">
                                <div className="font-bold text-xl">{elem.nickname}</div>
                                <div className="mt-2 text-lg">{elem.comment}</div>
                              </div>
                              <img
                                className="w-24 h-24 object-cover rounded-full"
                                src={elem.profile}
                                alt="Profile"
                              />
                            </div>
                          </div>
                        </Card>
                        <div className="border-b border-gray-200 mt-2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            </div>
            {isLoading && <div>Loading...</div>}
          </div>
        </div>
      </div>
  
  );
}
