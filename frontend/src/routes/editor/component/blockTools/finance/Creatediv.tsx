import React,{useState,useEffect} from 'react'

export default function Creatediv(data,company) {

    const [date, setDate] = useState([]);
    

    console.log(date);
  


  useEffect(() => {
    setDate(data.data);

  }, [data]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' 원';
  };

    const groupedData = date.reduce((acc, item) => {

    const year = item.bsns_year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((year) => (
            <>
            <div>
              <tr key={year}>
                <td colSpan="3">{year}년도 재무제표</td>
              </tr>
              {groupedData[year].map((item, index) => (
                
                <tr key={index}>
                  <td></td>
                  <td>{item.account_nm}</td>
                  <td>{formatNumber(item.thstrm_amount)}</td>
                </tr>
               
              ))}
              </div> 
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

