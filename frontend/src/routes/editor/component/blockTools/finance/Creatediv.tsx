import React, { useState, useEffect } from 'react';

interface DataItem {
  bsns_year: number;
  account_nm: string;
  thstrm_amount: number;
}

interface DataProps {
  data: DataItem[];
  company: string;
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
    return (Math.floor(num / 1000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '천원';
  };

  const groupedData: GroupedData = date.reduce((acc: GroupedData, item: DataItem) => {
    const year = item.bsns_year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunkedArr: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const groupedDataArray = Object.keys(groupedData).map(year => ({
    year: Number(year),
    data: groupedData[Number(year)]
  }));

  const chunkedData = chunkArray(groupedDataArray, 5);

  return (
    <div className="p-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th colSpan={5} className="text-center text-xl font-bold">
              {company}
            </th>
          </tr>
        </thead>
        <tbody>
          {chunkedData.map((chunk, chunkIndex) => (
            <React.Fragment key={chunkIndex}>
              <tr className="flex justify-center font-bold">
                {chunk.map(({ year }) => (
                  <td key={year} className="flex-1 text-center border-r border-gray-400 p-2">
                    {year}년도 재무제표
                  </td>
                ))}
              </tr>
              <tr className="flex justify-center">
                {chunk.map(({ year, data }) => (
                  <td key={year} className="flex-1 text-center border-r border-gray-400 p-2">
                    {data.map((item, index) => (
                      <div key={index} className="flex justify-between my-2">
                        <div className="w-1/2">{item.account_nm}</div>
                        <div className="w-1/2">{formatNumber(item.thstrm_amount)}</div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

