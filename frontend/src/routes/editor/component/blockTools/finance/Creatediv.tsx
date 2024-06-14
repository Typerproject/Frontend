import React, { useState, useEffect } from 'react';

interface DataItem {
  bsns_year: number;
  account_nm: string;
  thstrm_amount: number;
}

interface DataProps {
  data: DataItem[];
  company:string;
}

interface GroupedData {
  [key: number]: DataItem[];
}

export default function Creatediv({ data, company }: DataProps) {
  const [date, setDate] = useState<DataItem[]>([]);


  useEffect(() => {
    setDate(data);
  }, [data]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 원';
  };

  const groupedData: GroupedData = date.reduce((acc: GroupedData, item: DataItem) => {
    const year = item.bsns_year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <div>
      <table >
        <thead>
          <tr>
            <th >{company}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((year) => (
            <React.Fragment key={year}>
              <tr>
                <td colSpan={3}>{year}년도 재무제표</td>
              </tr>
              {groupedData[Number(year)].map((item, index) => (
                <tr key={index}>
                  <td></td>
                  <td>{item.account_nm}</td>
                  <td>{formatNumber(item.thstrm_amount)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

