import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

interface FinanceReportModalProps{
  creatediv:any;
  onExit: () => void;
}
interface FormData {
  company: string;
  startDate: number;
  endDate: number;
}

interface Fin {
  "수익(매출액)": boolean;
  "매출원가": boolean;
  "매출총이익": boolean;
  "판매비와관리비": boolean;
  "당기순이익": boolean;
  "영업활동현금흐름": boolean;
  "투자활동현금흐름": boolean;
  "재무활동현금흐름": boolean;
  "재고자산": boolean;
  "유동부채": boolean;
  "단기차입금": boolean;
  "자본금": boolean;
}

type FinKeys = keyof Fin;

const FinanceModal:React.FC<FinanceReportModalProps> = ({creatediv,onExit}) => {
    const [show, setShow] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
      company: "",
      startDate: 0,
      endDate: 0
    });
  

    const [fin,setFin]=useState<Fin>({
      "매출액":false,
      "매출원가":false,
      "매출총이익":false,
      "판매비와관리비":false,
      "당기순이익":false,
      "영업활동현금흐름":false,
      "투자활동현금흐름":false,
      "재무활동현금흐름":false,
      "재고자산":false,
      "유동부채":false,
      "단기차입금":false,
      "자본금":false
    });

    const [error, setError] = useState<String>("");
  
    const handleClose = () => setShow(false);
    const handleChange = (e:any) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
      
      
      // 입력 검증
      if (!formData.company) {
        onExit()
        return alert("기업이름이 잘못되었습니다!")
        
      }
      if( !formData.startDate || !formData.endDate){
        onExit()
        return alert("시작기간하고 종료기간이 잘못되었습니다.")
      }

      if (formData.startDate<2015 && formData.endDate>2023){
        onExit()
        return alert("시작 년도는 2015년부터 끝년도는 2023년도 입니다.")
      }
  
      try {
        const data = await fetchData(formData);

        

       
        if (data.length === 0) {
          onExit()
          return alert("검색 결과가 없습니다!");
        }
        console
        creatediv(data,formData.company);
        setShow(false);
      } catch (error:any){
        if (error.response && error.response.status === 403) {
          return alert("회사 이름이 잘못되었습니다!");
        }
      
        
        alert("입력 형식이 잘못되었습니다!")
        onExit()
      } 
      
    };

    
    const fetchData=async (d:FormData)=>{
        const data=await axios.get(`${import.meta.env.VITE_SERVER_FINANCE_API_URI}?company=${formData.company}&startdate=${formData.startDate}&enddate=${formData.endDate}`)

        


      const response = data.data;
      console.log(response)

      const selectedKeys = Object.keys(fin).filter(key => fin[key as FinKeys]);

      const regexList = selectedKeys.map(key => new RegExp(key, 'i'));

      const filteredData = response.filter((elem: any) =>
        regexList.some(regex => regex.test(elem.account_nm))
      );

      const uniqueFilteredData = Array.from(
        new Map(filteredData.map(item => [`${item.account_nm}-${item.bsns_year}`, item])).values()
      );
      

      return uniqueFilteredData;
    }

    const handleToggle = (key:any) => {
      setFin((prevFin:any) => ({
        ...prevFin,
        [key]: !prevFin[key]
      }));
    };
  
    return (
      <>
        <Modal show={show} onHide={() => setShow(false)} >
          <Modal.Header closeButton>
            <Modal.Title>기업이름 입력해주세요!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-content" style={{height:"500px"}}>
            <Form>
              <Form.Group controlId="formStockCode">
                <Form.Label>기업</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="기업이름"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </Form.Group> 
              
              <Form.Label>재무재표 요소 선택</Form.Label>
            <Form.Group controlId="formFinanceElements" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

              {Object.keys(fin).map((key) => (
                <Button
                  key={key}
                  onClick={() => handleToggle(key)}
                  variant={fin[key as FinKeys] ? "primary" : "outline-primary"}
                  style={{ margin: "3px" }}
                >
                  {key}
                </Button>
              ))}
              
            </Form.Group>

              <Form.Group controlId="formS
              tartDate">
                <Form.Label>입력 년도 (시작)</Form.Label>
                <Form.Control
                  type="input"
                  placeholder="조회 시작은 2015년도 부터 가능합니다."
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>입력 년도 (종료) </Form.Label>
                <Form.Control
                  type="input"
                  placeholder="조회 끝은 2023년도까지입니다!"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{handleClose(),onExit()}}>
              닫기
            </Button>
            <Button variant="primary" onClick={handleSave}>
              재무재표 나오게 하기
            </Button>
          </Modal.Footer>
        </Modal>
        
      </>
    );
  };


  export default FinanceModal;