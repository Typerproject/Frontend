import { useState, useEffect, useRef, useCallback } from "react";
import { IPost } from "../../../api/postDetailAPI";
import axios from "axios";
// import Post from "../../scrap/component/Post";
import MainPost from "../../main/component/Post";

type Props = {
  searchText: string;
};

export default function PostCard({ searchText }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [postData, setPostData] = useState<IPost[]>([]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && !isDone) {
        console.log('인식됨!!');
        setPage((page) => page + 1);
      }
    },
    [isLoading, isDone]
  );

  //무한 스크롤
  // const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  const fetchMorePosts = useCallback(
    () =>
      (async () => {
        if(!searchText) {
          return;
        }
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        if (page === 1) {
          setPostData([]);
        }
        try {
          setIsLoading(true);
          axios
            .get(`${import.meta.env.VITE_SERVER_SEARCH_API_URI}`, {
              params: {
                value: searchText,
                page: page,
              },
            })
            .then((resp) => resp.data)
            .then((data) => {
              // console.log(data);
              console.log(data, "\n\npage: ", page);
              setPostData((prevPostList) =>
                page === 1
                  ? [...data.result]
                  : [...prevPostList, ...data.result]
              );
              setTotal(data.total);

              if (data.result.length === 0) {
                setIsDone(() => true);
              }
              setIsLoading(false);
            })
            .catch(() => {
              // setIsLoading(false);
              setTotal(0);
              setPostData([]);
            });
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      })(),
    [page, searchText]
  );

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    fetchMorePosts();
  }, [fetchMorePosts]);

  useEffect(()=>{
    if(!searchText) {
      setPostData([]);
      setTotal(0);
    }
  }, [searchText])

  return (
    <div>
      <p className="text-gray-500 pb-[2rem]">검색 결과 : {total ? total : 0}개</p>
      {postData.length !== 0 &&
        postData?.map((post) => (
          <>
            <MainPost key={post._id} post={post} />
          </>
        ))}
      {searchText ? (
        isLoading ? (
          <div className="p-[2rem] text-center">loading..</div>
        ) : (
          <div id="observer" style={{ height: "10px" }}></div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
