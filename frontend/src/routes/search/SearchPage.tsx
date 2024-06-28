// import React from 'react'
import { Card, Button } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import PostCard from "./component/PostCard";
import WriterCard from "./component/WriterCard";

export interface Pre {
  text: string;
  img: string;
}

interface Preview {
  profile: string;
  nickname: string;
  _id: string;
  title: string;
  preview: Pre;
}

interface Writer {
  userId: string;
  profile: string;
  nickname: string;
  comment: string;
}

// type Props = {}
type active = "글" | "작가";

export default function SearchPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<active>("글");
  //검색어 상태
  const [searchText, setSearchText] = useState<string>("");
  //정보 가져오는 상태
  const [postData, setPostData] = useState<Preview>();
  const [writerData, setWriterData] = useState<Writer>();
  const [total, setTotal] = useState<number>(0);
  //스크롤 관련 상태
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  console.log(activeTab);

  const handleTabClick = (tab: active) => {
    setActiveTab(tab);
    setPage(1); // 탭 변경 시 페이지를 1로 초기화 (이건 필요할 듯)
    // if (tab === "글") {
    //   setPost(true);
    //   setWriter(false);
    // } else {
    //   setPost(false);
    //   setWriter(true);
    // }
  };

  return (
    <>
      <Navbar />
      <div className="py-[3rem] px-[2rem]">
        <div className="flex justify-center items-center py-12">
          <input
            className="w-full h-[3rem] shadow-sm p-[1rem] text-xl border rounded"
            //value={searchtext}
            onChange={(e) => setSearchText(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder=" 검색어를 입력해주세요."
          />
        </div>
        <div className="flex gap-[5px]">
          <Button
            onClick={() => handleTabClick("글")}
            className={`bg-white border-none hover:text-gray-500 
                ${activeTab === "글" ? "text-black" : "text-gray-500"}
              `}
          >
            글
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
          //   ref={mainPostContainerRef}
        >
          <div className="w-full">
            {activeTab === "글" ? (
              <PostCard searchText={searchText} />
            ) : (
              <WriterCard searchText={searchText} />
            )}
            {/* {post &&
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
              ))} */}

            {/* {writer &&
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
              ))} */}
          </div>
        </div>
      </div>
    </>
  );
}
