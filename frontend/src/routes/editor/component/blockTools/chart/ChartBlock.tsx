import { useState } from "react";
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
      title: "chart",
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

  const handleClose = () => {
    onExit();
    setShow(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const stockResp = await service.getStockData(formData);

      setData(stockResp);
      setShow(false);
    } catch (error) {
      console.error("Failed to fetch stock data", error);
    } finally {
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
                  <label className="block text-gray-700">종목 코드</label>
                  <input
                    type="text"
                    placeholder="종목번호 (6자리)"
                    name="stockCode"
                    value={formData.stockCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    입력 날짜 (시작)
                  </label>
                  <input
                    type="date"
                    placeholder="조회 시작일자 (ex. 20220501)"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    입력 날짜 (종료)
                  </label>
                  <input
                    type="date"
                    placeholder="조회 종료일자 (ex. 20220530)"
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
                차트 그리기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
