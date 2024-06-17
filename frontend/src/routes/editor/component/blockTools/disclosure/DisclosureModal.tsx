import { useRef, useState } from "react";
import editorAPI from "../../../../../api/editorAPI";

interface corpCode {
  _id: string;
  corpName: string;
  corpCode: string;
}

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

export default function DisclosureModal() {
  const searchResult = useRef<corpCode[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [list, setList] = useState<corpCode[]>([]);
  const [page, setPage] = useState<number>(2);
  const [isMore, setMore] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);

  const nameChange = async () => {
    searchResult.current.length = 0;
    setPage(2);
    const res = await service.getCorpCode(searchName, 1);
    searchResult.current.push(...res.result);
    setList([...searchResult.current]);
    if (page < res.totalPages) {
      setMore(true);
    } else {
      setMore(false);
    }
  };

  const searchMore = async () => {
    const res = await service.getCorpCode(searchName, page);
    searchResult.current.push(...res.result);
    setList([...searchResult.current]);
    setPage(page + 1);
    if (page < res.totalPages) {
      setMore(true);
    } else {
      setMore(false);
    }
  };
  const handleClose = () => setShow(false);

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 min-h-[1vh]">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-2 z-10">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">공시를 조회할 기업 선택</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  handleClose();
                }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-4">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="검색할 기업 이름 입력"
                  required
                  onChange={(e) => {
                    setSearchName(e.target.value);
                  }}
                />
                <button
                  className="text-white absolute end-2.5 bottom-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
                  onClick={() => {
                    nameChange();
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="min-h-[50vw] max-h-[40vw] overflow-y-scroll m-3">
              {list.map((ele, idx) => {
                return <div key={idx}>{ele.corpName + " " + ele.corpCode}</div>;
              })}
            </div>
            {isMore && (
              <div
                onClick={() => {
                  searchMore();
                }}
              >
                데이터가 더 있음
              </div>
            )}

            {/* <div className="flex justify-end p-4 border-t border-gray-200">
            <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
              닫기
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              차트 그리기
            </button>
          </div> */}
          </div>
        </div>
      )}
    </>
  );
}
