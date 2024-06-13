import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface AnalystReportModalProps{
  createIframe:any;
}

const AnalystReportModal: React.FC<AnalystReportModalProps> = ({ createIframe })=> {
  const [show,setShow]=useState<boolean>(true);
  const [reportshow,setReportshow]=useState<boolean>(false);
  const [formData, setFormData] = useState({ company: "" });
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

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
      const response = await axios.get(`http://localhost:3000/api/editor/report`, {
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
      <Modal show={show}>
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
        {reports.map((report:any, index) => (
          <div key={index} onClick={() => {createIframe(report.url);setReportshow(false);}}>
            <div>
              Company: {report.company}
              <br />
              Date: {report.date}
              <br />
              Title: {report.title}
              <br />
              Analyst: {report.analyst}
              <br />
            </div>
          </div>
        ))}
        </Modal.Body>
        <Button  onClick={() => setReportshow(false)}>
            닫기
        </Button>
     </Modal>
    </>
  );
};

export default AnalystReportModal;