import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface AnalystReportModalProps {
  createIframe: any;
  onExit: () => void;
}

const AnalystReportModal: React.FC<AnalystReportModalProps> = ({ createIframe, onExit }) => {
  const [show, setShow] = useState<boolean>(true);
  const [reportshow, setReportshow] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<string>("");
  const [formData, setFormData] = useState({ company: "", fromDate: "", toDate: "" });
  const [reports, setReports] = useState<any[]>([]);
  const [mainloading, setMainLoading] = useState(false);
  const [error, setError] = useState("");

  const [isMore,setMore] = useState<boolean>(true);
  const [nextDate, setNextDate] = useState<string>("");
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setShow(false);
      setMainLoading(true);
      setMore(true);
      const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
        params: { company: formData.company, fromDate: formData.fromDate, toDate: formData.toDate, page: 1 }
      });

      if (response.data.result.length === 0) {
        alert('검색결과가 없네요!');
        onExit();
        setReportshow(false);
        setMainLoading(false);
        return;
      }

      setNextPage(response.data.nextPage);
      setReportshow(true);
      setMainLoading(false);
      setReports(response.data.result);
      setNextDate(response.data.nextDate);
      onExit();
      setError("");
    } catch (err) {
      onExit();
    }
  };

  const searchMore = async () => {
    try {
      if ('2024-06-08'<formData.toDate){
      const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
        params: { company: formData.company, fromDate: formData.fromDate, toDate: nextDate, page: nextPage  }
      });
          if (response.data.result.length>0){
          setMore(true);
          setReports(prevReports => [...prevReports, ...response.data.result]);
          setNextDate(response.data.nextDate);
          setNextPage(response.data.nextPage);
        }else{
        
        setMore(false);
        }
      }
      else {

        const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
          params: { company: formData.company, fromDate: formData.fromDate, toDate: formData.toDate, page: nextPage  }
        });
            if (response.data.result.length>0){
            setMore(true);
            setReports(prevReports => [...prevReports, ...response.data.result]);
            setNextPage(response.data.nextPage);
          }else{
          
          setMore(false);
          }

      }


     

      
    } catch (error) {
      onExit();
      console.error("Error fetching more reports:", error);
    }
  };

  const handleScroll = () => {
    if (modalBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        searchMore();
      }
    }
  };

  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (modalBodyRef.current) {
        modalBodyRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>기업이름 입력해주세요!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="space-y-4">
      <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">기업</label>
      <input
        type="text"
        placeholder="기업이름"
        name="company"
        value={formData.company}
        onChange={handleChange}
        className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        </div>
       <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">시작날짜</label>
        <input
          type="date"
          placeholder="2020-01-01부터 조회 가능합니다."
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">끝나는 날짜</label>
            <input
              type="date"
            placeholder="현재 날짜까지 가능합니다."
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { setShow(false); onExit(); }}>
            닫기
          </Button>
          <Button onClick={handleSave}>
            기업 검색
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mainloading} >
        <Modal.Body>
          로딩중입니다!
        </Modal.Body>
      </Modal>

      <Modal show={reportshow} dialogClassName="max-w-4xl mx-auto w-full h-2xl">
      <Modal.Header className="flex flex-col items-start space-y-4">
          <div className="w-full flex justify-between items-center">
            <Modal.Title className="text-lg font-semibold">기업 리포트입니다.</Modal.Title>
            <Button className="bg-white border-none text-black hover:text-black-700" onClick={() => { setReportshow(false); onExit(); }}>
              X
            </Button>
          </div>
        <div className="w-full">
      <Modal.Title className="text-lg font-semibold">날짜 변경</Modal.Title>
        <div className="mt-2">
        <Form.Label className="block text-sm font-medium text-gray-700">시작날짜</Form.Label>
        <Form.Control
          type="date"
          placeholder="2020-01-01부터 조회 가능합니다."
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
        <div className="mt-2">
          <Form.Label className="block text-sm font-medium text-gray-700">끝나는 날짜</Form.Label>
            <Form.Control
            type="date"
            placeholder="현재 날짜까지 가능합니다."
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
           />
          </div>
            <Button
            onClick={handleSave}
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent  text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            날짜 변경
            </Button>
        </div>
        </Modal.Header>
        <Modal.Body ref={modalBodyRef} style={{ maxHeight: "40vh", overflowY: "auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report: any, index: number) => (
          <div 
            key={index} 
            onClick={() => { 
            createIframe(report.url); 
            setReportshow(false); 
            }} 
            className="border p-4 rounded-md hover:bg-gray-100 cursor-pointer"
          >
        <div>
          {index + 1}번 리포트
            <br />
            Company: {report.company}
            <br />
            Date: {report.date.split("T")[0]}
              <br />
              Title: {report.title}
              <br />
              Analyst: {report.analyst}
              <br />
            </div>
          </div>
          ))}
          </div>
          {isMore && (
            <div className=" bg-white py-2">
              <Button className="mt-4 w-full" onClick={searchMore}>더 불러 오기</Button>
            </div>
            )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AnalystReportModal;


