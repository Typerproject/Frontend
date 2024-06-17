import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface AnalystReportModalProps{
  createIframe:any;
}

const AnalystReportModal: React.FC<AnalystReportModalProps> = ({ createIframe })=> {
  const [show,setShow]=useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reportshow,setReportshow]=useState<boolean>(false);
  const [isLoading,setIsLoding]=useState<boolean>(false);
  const [formData, setFormData] = useState({ company: "" });
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const reportspage=3;

  

  const totalpages=Math.ceil(reports.length/reportspage);

  
  const currentReports = reports.slice((currentPage - 1) * reportspage, currentPage * reportspage);
  console.log(currentReports)

  const handleNextPage = () => {
    setCurrentPage((prevPage:number) => Math.min(prevPage + 1, totalpages));
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

  const handleSave = async () => {
    try {
      setReportshow(true);
      const response = await axios.get(import.meta.env.VITE_SERVER_REPORT_API_URI, {
        params: { company: formData.company }
      });
      setReports(response.data);
      setError("");
      setShow(false);
    } catch (err) {
      setError("검색안됨!");
      setReports([]);
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
          <Button  onClick={() => setShow(false)}>
            닫기
          </Button>
          <Button  onClick={handleSave}>
            기업 검색
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <div>{error}</div>}

      <Modal show={reportshow}>
        <Modal.Header>
          <Modal.Title>기업리포트는 다음과 같으며, 클릭시 해당 기업 리포트로 이동합니다.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentReports.map((report: any, index) => (
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
    ))}
  <Modal.Footer>
   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px',gap:'10px' }}>
      <Button onClick={handlePrevPage} disabled={currentPage === 1}>이전</Button>
      <Button onClick={handleNextPage} disabled={currentPage === totalpages}>다음</Button>
      <Button onClick={() => setReportshow(false)}>
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