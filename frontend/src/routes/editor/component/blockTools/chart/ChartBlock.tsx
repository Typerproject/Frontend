import { KeyboardEvent, useEffect, useRef, useState } from "react";
import CreateDOM from "react-dom/client";
import JsonChartTest from "./Chart";
import editorAPI from "../../../../../api/editorAPI";
import { API } from "@editorjs/editorjs/types/index";

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

interface chartBlockProps {
  data: stockResp;
  api: API;
}

export interface stockResp {
  stockTitle: string;
  data: stockData[];
}
interface stockData {
  open: string;
  high: string;
  low: string;
  close: string;
  date: string;
}

interface CodeItem {
  code: string;
  name: string;
}

export class ChartBLock {
  data: stockResp;
  nodes: HTMLElement | null;
  api: API;

  constructor({ data, api }: chartBlockProps) {
    this.data = data;
    this.nodes = null;
    this.api = api;
  }

  static get toolbox() {
    return {
      title: "주가차트",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M3,21V0H0V21a3,3,0,0,0,3,3H24V21Z"/><rect x="18" y="9" width="3" height="9"/><rect x="6" y="9" width="3" height="9"/><rect x="12" y="4" width="3" height="14"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const rootNode = document.createElement("div");
    this.nodes = rootNode;

    const current = this.api.blocks.getCurrentBlockIndex();

    if (Object.keys(this.data).length === 0) {
      const modal = document.createElement("div");

      const modalRoot = CreateDOM.createRoot(modal);
      const chartRoot = CreateDOM.createRoot(rootNode);

      modalRoot.render(
        <ChartModal
          setData={(data) => {
            this.data = data;
            chartRoot.render(<JsonChartTest stockData={data} />);
            modal.remove();
          }}
          onExit={() => {
            this.api.blocks.delete(current);
            modal.remove();
          }}
        />
      );
      document.getElementById("root")?.appendChild(modal);
    } else {
      CreateDOM.createRoot(rootNode).render(
        <JsonChartTest stockData={this.data} />
      );
    }

    return rootNode;
  }

  save() {
    return this.data;
  }
}

interface ChartModalProps {
  setData: (data: stockResp) => void;
  onExit: () => void;
}

const ChartModal = ({ setData, onExit }: ChartModalProps) => {
  const [show, setShow] = useState(true);
  const [formData, setFormData] = useState({
    marketCode: "J",
    stockCode: "",
    startDate: "",
    endDate: "",
    period: "",
    prc: "0",
  });
  const [codeList, setCodeList] = useState<CodeItem[]>([]);
  const [codeSearch, setCodeSearch] = useState("");
  const [filteredCodes, setFilteredCodes] = useState<CodeItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // 선택된 항목의 인덱스
  const dropdownRef = useRef<HTMLUListElement>(null); // 드롭다운 요소의 ref
  const inputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    service
      .getCodeList()
      .then((data) => {
        setCodeList(data.codeList);
      })
      .catch((err) => {
        setCodeList([]);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (codeSearch && codeList) {
      const filtered = codeList.filter((item) => {
        return item.name.toLowerCase().includes(codeSearch.toLocaleLowerCase());
      });

      setShowDropdown(true);
      setFilteredCodes(filtered);
      setSelectedIndex(-1);
    } else {
      setShowDropdown(false);
      setFilteredCodes([]);
      setSelectedIndex(-1);
    }
  }, [codeSearch, codeList]);

  const handleFocusToDropdown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredCodes.length > 0 && showDropdown) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (dropdownRef.current) {
            dropdownRef.current.focus();
          }
          break;
        default:
          break;
      }
    }
  };

  const handleCodeKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (filteredCodes.length === 0) {
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (selectedIndex === 0) {
          inputRef.current?.focus();
        } else {
          setSelectedIndex((preIndex) => Math.max(preIndex - 1, 0));
        }

        break;

      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredCodes.length - 1)
        );
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex !== -1) {
          handleSelect(filteredCodes[selectedIndex]);
          setSelectedIndex(-1);
          setFilteredCodes([]);
          setShowDropdown(false);
        }
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    onExit();
    setShow(false);
  };

  const handleSelect = (item: CodeItem) => {
    setCodeSearch(item.name);
    setFormData({ ...formData, stockCode: item.code });
    setFilteredCodes([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (dropdownRef.current && selectedIndex !== -1) {
      const selectedElement = dropdownRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCodeSearch(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "startDate") {
      setStartDate(value);
      const start = new Date(value);
      start.setDate(start.getDate() + 100);

      const end = start.toISOString().split("T")[0];

      const today = new Date().toISOString().split("T")[0];

      setEndDate(end < today ? end : today);
    }
  };

  const handleSave = async () => {
    try {
      const start = new Date(formData.startDate);
      start.setDate(start.getDate() + 100);

      if (start.toISOString().split("T")[0] < formData.endDate) {
        alert("조회 범위는 최대 100일 입니다.");
        return;
      }

      const stockResp = await service.getStockData(formData);
      setData(stockResp);
      setShow(false);
    } catch (error) {
      console.error("Failed to fetch stock data", error);
      setShow(false);
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-2 z-10">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">
                국내주식기간별시세(일/주/월/년)
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleClose}
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
            <div className="p-4">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">종목 이름</label>
                  <input
                    ref={inputRef}
                    type="text"
                    name="stockCode"
                    placeholder="(ex. 삼성전자)"
                    autoComplete="off"
                    value={codeSearch}
                    onChange={handleCodeChange}
                    onKeyDown={handleFocusToDropdown}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  {showDropdown &&
                    filteredCodes.length > 0 &&
                    codeSearch !== filteredCodes[0].name && (
                      <ul
                        ref={dropdownRef}
                        className="absolute z-10 border border-gray-300 mt-2 rounded-md shadow-sm max-h-40 overflow-y-auto bg-gray-100"
                        onKeyDown={handleCodeKeyDown}
                        tabIndex={0}
                      >
                        {filteredCodes.map((item, index) => (
                          <li
                            key={item.code}
                            className={`p-2 hover:bg-gray-200 cursor-pointer ${
                              index === selectedIndex ? "bg-gray-200" : ""
                            }`}
                            onClick={() => handleSelect(item)}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    입력 날짜 (시작)
                  </label>
                  <input
                    type="date"
                    placeholder="조회 시작일자 (ex. 20220501)"
                    name="startDate"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4 ">
                  <label className="block text-gray-700">
                    입력 날짜 (종료)
                  </label>
                  <input
                    type="date"
                    placeholder="조회 종료일자 (ex. 20220530)"
                    min={startDate}
                    max={endDate}
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">기간 분류 코드</label>
                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="D">일봉</option>
                    <option value="W">주봉</option>
                    <option value="M">월봉</option>
                    <option value="Y">년봉</option>
                  </select>
                </div>
                {/* 주석 처리된 Form.Group은 그대로 유지 */}
                {/* 
              <div className="mb-4">
                <label className="block text-gray-700">수정주가 원주가 가격 여부</label>
                <input
                  type="text"
                  placeholder="0 (수정주가)"
                  name="prc"
                  value={formData.prc}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  disabled
                />
              </div>
              */}
              </form>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleClose}
              >
                닫기
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
