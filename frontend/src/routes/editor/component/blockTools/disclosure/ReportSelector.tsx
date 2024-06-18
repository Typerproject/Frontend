import React, { useEffect, useRef, useState } from "react";
import { reportType } from "./ChooseReportPage";
import editorAPI from "../../../../../api/editorAPI";
import Parse, {
  Element,
  attributesToProps,
  domToReact,
} from "html-react-parser";

interface ReportSelectorProps {
  targetReport: reportType;
}

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

export default function ReportSelector({ targetReport }: ReportSelectorProps) {
  const [reportHTML, setReportHTML] = useState<any>();
  const [selectedElement, setSelectedElement] = useState<any>();
  const seletedElementRef = useRef([]);
  const id = useRef<number>(1);
  const key = useRef<number>(1);

  useEffect(() => {
    const fetch = async () => {
      const res = await service.getReport(targetReport.rceptNo);
      const parsedHTML = Parse(res, {
        replace: (node) => {
          if (node instanceof Element && node.attribs) {
            if (node.attribs.class?.includes("target")) {
              const props = attributesToProps(node.attribs);

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
    console.log(ele);
    const finded = seletedElementRef.current.find((e) => {
      return e.props.id === ele.props.id;
    });

    if (finded) {
      console.log("finded!! " + finded);
      seletedElementRef.current = seletedElementRef.current.filter(
        (e) => e.props.id !== finded.props.id
      );
      setSelectedElement([...seletedElementRef.current]);
      console.log(seletedElementRef.current);
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
      <div className="fixed inset-0 flex items-center justify-center z-50 min-h-[70vh]">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[90%] mx-2 z-10">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">문서에서 추출할 요소를 선택</h2>
            <button className="text-gray-500 hover:text-gray-700">
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
              <div className="overflow-y-scroll max-h-[70vh] flex flex-col">
                {selectedElement}
              </div>
            </div>

            <div className="w-[50%]">
              <p className="text-center font-bold">기존 문서</p>
              <div className="overflow-y-scroll max-h-[70vh]">{reportHTML}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
