import React, { useEffect, useRef, useState } from "react";
import { reportType } from "./ChooseReportPage";
import editorAPI from "../../../../../api/editorAPI";
import Parse, {
  Element,
  attributesToProps,
  domToReact,
} from "html-react-parser";
import "./css/Dart.css";
import "./css/HTML.css";

interface ReportSelectorProps {
  targetReport: reportType;
  setData: (data: any) => void;
  onExit: () => void;
}

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

export default function ReportSelector({
  targetReport,
  setData,
  onExit,
}: ReportSelectorProps) {
  const [reportHTML, setReportHTML] = useState<any>();
  const [selectedElement, setSelectedElement] = useState<any>();
  const seletedElementRef = useRef([]);
  const [type, setType] = useState<string>("");
  const id = useRef<number>(1);
  const key = useRef<number>(1);

  useEffect(() => {
    const fetch = async () => {
      const res = await service.getReport(targetReport.rceptNo);
      setType(res.type);
      const parsedHTML = Parse(res.body, {
        replace: (node) => {
          if (node instanceof Element && node.attribs) {
            if (node.attribs.class?.includes("target")) {
              const props = attributesToProps(node.attribs);
              props.class = node.attribs.class + " " + res.type;
              const returnEle = (
                <node.name
                  onClick={() => {
                    addElement(returnEle);
                  }}
                  {...props}
                  id={getId()}
                  key={key.current++}
                >
                  {domToReact(node.children)}
                </node.name>
              );

              return returnEle;
            }
          }
        },
      });

      setReportHTML(parsedHTML);
    };
    fetch();
  }, []);

  const addElement = (ele) => {
    const finded = seletedElementRef.current.find((e) => {
      return e.props.id === ele.props.id;
    });

    if (finded) {
      seletedElementRef.current = seletedElementRef.current.filter(
        (e) => e.props.id !== finded.props.id
      );
      setSelectedElement([...seletedElementRef.current]);
      return;
    }

    seletedElementRef.current.push(ele);
    setSelectedElement([...seletedElementRef.current]);
  };

  const getId = () => {
    return id.current++;
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center min-h-[70vh] z-[10000]">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[90%] mx-2 z-10">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">문서에서 추출할 요소를 선택</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                onExit();
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
          <div className="px-4 min-h-[80%] flex">
            <div className="w-[50%]">
              <p className="text-center font-bold">선택된 요소</p>
              <div className="overflow-y-scroll max-h-[65vh] flex flex-col">
                {selectedElement}
              </div>
            </div>

            <div className="w-[50%]">
              <p className="text-center font-bold">기존 문서</p>
              <div className="overflow-y-scroll max-h-[65vh]">{reportHTML}</div>
            </div>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 w-[12%]"
              onClick={() => {
                onExit();
              }}
            >
              닫기
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-[12%]"
              onClick={() => {
                setData({
                  type: type,
                  body: selectedElement,
                  reportCode: targetReport.rceptNo,
                });
              }}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
