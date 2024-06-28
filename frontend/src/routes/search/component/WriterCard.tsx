// import React from "react";
import { Card } from "react-bootstrap";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { response } from "express";

interface WData {
  id: string;
  profile: string;
  nickname: string;
  comment: string;
}

interface ResponseData {
  result: WData[];
  total: number;
}

type Props = {
  searchText: string;
};

export default function WriterCard({ searchText }: Props) {
  const navigate = useNavigate();

  //유저 정보 상태
  const [writerData, setWriterData] = useState<WData[]>([]);
  const [total, setTotal] = useState<number>(0);

  //무한 스크롤 상태
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isDone) {
        setPage((page) => page + 1);
      }
    },
    [isLoading, isDone]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    // 최하단 요소를 관찰 대상으로 지정
    const observerTarget = document.getElementById("observer");
    // 관찰 시작
    if (observerTarget) {
      observerRef.current.observe(observerTarget);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const fectchMoreWriter = useCallback(
    () =>
      (async () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        if (page === 1) {
          setWriterData([]);
        }
        try {
          setIsLoading(true);
          await axios
            .get<ResponseData>(
              `${import.meta.env.VITE_SERVER_SEARCH_API_URI}/writer`,
              {
                params: {
                  value: searchText,
                  page: page,
                },
              }
            )
            .then((response) => {
              //setWriterData(response.data.result); // response.data를 상태에 맞게 설정
              setWriterData((writerData) =>
                page === 1
                  ? response.data.result
                  : [...writerData, ...response.data.result]
              );
              setTotal(response.data.total);
              if (response.data.result.length === 0) {
                setIsDone(() => true);
              }
              setIsLoading(false);
            });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })(),
    [searchText, page]
  );

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    fectchMoreWriter();
  }, [fectchMoreWriter]);

  console.log("page is ", page, " and total is ", total);

  return (
    <div>
      <div>
        {writerData.length === 0 ? (
          <div className="text-center text-3xl">검색 결과가 없습니다</div>
        ) : (
          <div>
            <div className="text-gray-500 mb-[2rem]">검색 결과: {total}개</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {writerData.map((elem: any, idx) => (
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
                        <div className="font-bold text-lg">{elem.nickname}</div>
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
        )}
      </div>
      {isLoading ? (
        <>loading..</>
      ) : (
        <div id="observer" style={{ height: "10px" }}></div>
      )}
    </div>
  );
}
