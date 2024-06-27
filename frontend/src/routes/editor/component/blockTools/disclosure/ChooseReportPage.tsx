import React, { useRef, useState } from "react";
import { corpCode } from "./DisclosureModal";
import editorAPI from "../../../../../api/editorAPI";
import e from "express";
import ReportSelector from "./ReportSelector";

interface props {
  targetCorp: corpCode;
  onExit: () => void;
  setData: (data: any) => void;
}

export interface reportType {
  rceptNo: string;
  reportNm: string;
  rceptDt: string;
  flrNm: string;
}

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

export default function ChooseReportPage({
  targetCorp,
  onExit,
  setData,
}: props) {
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [bgn, setBgn] = useState<string>();
  const [end, setEnd] = useState<string>();

  const reportList = useRef<reportType[]>([]);
  const [list, setList] = useState<reportType[]>([]);
  const [isMore, setMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);
  const [show, setShow] = useState<boolean>(true);

  const [targetReport, setTargetReport] = useState<reportType | null>(null);

  const search = async () => {
    setPage(2);
    reportList.current.length = 0;
    if (bgn === "" || end === "") {
      alert("검색 일자를 입력해주세요");
      return;
    }

    const result = await service.getReportList(
      targetCorp.corpCode,
      bgn.split("-").reduce((acc, cur) => {
        return acc + cur;
      }, ""),
      end.split("-").reduce((acc, cur) => {
        return acc + cur;
      }, ""),
      1
    );
    if (result.status === "013") {
      alert("해당하는 날짜에 등록된 공시가 없습니다.");
      return;
    }

    result.list.map((ele: any) => {
      reportList.current.push({
        rceptNo: ele.rcept_no,
        reportNm: ele.report_nm,
        rceptDt: ele.rcept_dt,
        flrNm: ele.flr_nm,
      });
    });

    setList([...reportList.current]);

    if (result.total_page > result.page_no) {
      setMore(true);
    }
  };

  const searchMore = async () => {
    const res = await service.getReportList(
      targetCorp.corpCode,
      bgn.split("-").reduce((acc, cur) => {
        return acc + cur;
      }, ""),
      end.split("-").reduce((acc, cur) => {
        return acc + cur;
      }, ""),
      page
    );

    res.list.map((ele: any) => {
      reportList.current.push({
        rceptNo: ele.rcept_no,
        reportNm: ele.report_nm,
        rceptDt: ele.rcept_dt,
        flrNm: ele.flr_nm,
      });
    });

    setList([...reportList.current]);
    setPage(page + 1);

    if (page >= res.total_page) {
      setMore(false);
    }
  };

  const handleClose = () => {
    onExit();
  };

  return (
    <>
      {show && !targetReport && (
        <div className="fixed inset-0 flex items-center justify-center z-50 min-h-[70vh]">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => handleClose()}
          ></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[70%] mx-2 z-10">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">
                {targetCorp.corpName} 공시 문서 선택
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => handleClose()}
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
            <div className="px-4 flex justify-between flex-row py-2 items-center">
              <div>
                <label className="block text-gray-700">검색 시작 일자</label>
                <input
                  type="date"
                  max={getToday() > end ? end : getToday()}
                  placeholder="조회 시작일자 (ex. 20220501)"
                  className="mt-1 block border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) => {
                    const format = e.target.value;

                    setBgn(format);
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-700">검색 종료 일자</label>
                <input
                  type="date"
                  min={bgn}
                  max={getToday()}
                  placeholder="조회 종료일자 (ex. 20220530)"
                  className="mt-1 block border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) => {
                    const format = e.target.value;
                    setEnd(format);
                  }}
                />
              </div>
              <button
                type="button"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center h-[70%]"
                onClick={() => {
                  search();
                }}
              >
                검색
              </button>
            </div>
            <div className="min-h-[51vh] max-h-[51vh] overflow-y-scroll mx-3 mt-3">
              <div className="flex mx-3 font-bold text-center">
                <p className="w-[20%]">등록일자</p>
                <p className="w-[20%]">작성자</p>
                <p className="w-[60%]">제목</p>
              </div>

              {list.map((ele, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex px-2 py-2 mx-3 my-1 border border-solid border-gray-500 hover:bg-gray-300 text-center"
                    onClick={() => {
                      setTargetReport(ele);
                    }}
                  >
                    <p className="w-[20%]">{ele.rceptDt}</p>
                    <p className="w-[20%]">{ele.flrNm}</p>
                    <p className="w-[60%]">{ele.reportNm}</p>
                  </div>
                );
              })}
            </div>
            {isMore && (
              <div
                onClick={() => {
                  searchMore();
                }}
                className="flex py-2 justify-center hover:bg-gray-300"
              >
                <p>더 불러오기</p>
              </div>
            )}
          </div>
        </div>
      )}
      {targetReport && (
        <ReportSelector
          setData={setData}
          targetReport={targetReport}
          onExit={onExit}
        />
      )}
    </>
  );
}
