import React, { useState,useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface AnalystReportModalProps{
  createIframe:any;
  onExit: () => void;
}

const AnalystReportModal: React.FC<AnalystReportModalProps> = ({ createIframe, onExit })=> {
  const [show,setShow]=useState<boolean>(true);
  
  const [reportshow,setReportshow]=useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage,settotalPage]=useState<number>(0);
  const [formData, setFormData] = useState({ company: "" });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainloading, setmainLoading] = useState(false);
  const [error, setError] = useState("");

  const limit=3;

  

  

  

  const handleNextPage = () => {
    setCurrentPage((prevPage:number) => Math.min(prevPage + 1, totalPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage:number) => Math.max(prevPage - 1, 1));
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
          params: { company: formData.company, page: currentPage, limit: 3 }
        });
        setLoading(false);
        setReports(response.data.currentReports);
        settotalPage(response.data.totalpages); // Assuming totalPages is returned from the server
        
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [currentPage]);

  const handleSave = async () => {

    try {
      setShow(false);
      setmainLoading(true)
      const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
        params: { company: formData.company ,page:currentPage,limit:3}
      });
      
      if (response.data.currentReports.length === 0) {
        alert('검색결과가 없네요!');
        setReportshow(false);
        return;
      }
      setReportshow(true);
      setmainLoading(false);
      setReports(response.data.currentReports);

      settotalPage(response.data.totalpages)
      setError("");
      
    } catch (err) {
      onExit();
    }
  };

  

  
  return (
    <>
      <Modal show={show} >
        <Modal.Header>
          <Modal.Title>기업이름 입력해주세요!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStockCode">
              <Form.Label>기업</Form.Label>
              <Form.Control
                type="text"
                placeholder="기업이름"
                name="company"
                value={formData.company}
                onChange={handleChange}
                
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  onClick={() => {setShow(false),  onExit()}}>
            닫기
          </Button>
          <Button  onClick={handleSave}>
            기업 검색
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mainloading}>
      <Modal.Body>
        로딩중입니다!
      </Modal.Body>
      </Modal>

      <Modal show={reportshow}>
        <Modal.Header>
          <Modal.Title>기업리포트는 다음과 같으며, 클릭시 해당 기업 리포트로 이동합니다.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {loading ? (
      <p>리포트 불러오는 중입니다..</p> // Display loading message
    ) : (
      reports.map((report: any, index: number) => (
        <div key={index} onClick={() => { createIframe(report.url); setReportshow(false); }}>
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
          <br />
        </div>
      ))
    )}
  <Modal.Footer>
   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px',gap:'10px' }}>
      <Button onClick={handlePrevPage} disabled={currentPage === 1}>이전</Button>
      <Button onClick={handleNextPage} disabled={currentPage === totalPage}>다음</Button>
      <Button onClick={() => {setReportshow(false),onExit()}}>
        닫기
      </Button>
    </div>
    </Modal.Footer>
      </Modal.Body>
        
     </Modal>
    </>
  );
};

export default AnalystReportModal;