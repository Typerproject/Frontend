import React, { useState, useEffect } from "react";

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
    return (
      Math.floor(num / 1000)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "천원"
    );
  };

  const groupedData: GroupedData = date.reduce(
    (acc: GroupedData, item: DataItem) => {
      const year = item.bsns_year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    },
    {}
  );

  const groupedDataArray = Object.keys(groupedData).map((year) => ({
    year: Number(year),
    data: groupedData[Number(year)],
  }));

  return (
    <div className="p-4 flex justify-center">
      <table className="bg-white">
        <thead>
          <tr>
            <th className="text-center text-xl font-bold">{company}</th>
          </tr>
        </thead>
        <tbody className="flex flex-row  overflow-x-scroll max-w-[61.5vw] ">
          {groupedDataArray.map((perYear) => (
            // <React.Fragment key={chunkIndex}>
            <div className="flex flex-col min-w-fit">
              <tr className="flex justify-center font-bold">
                {
                  <td
                    key={perYear.year}
                    className="flex-1 text-center border-r border-gray-400 p-2"
                  >
                    {perYear.year}년도 재무제표
                  </td>
                }
              </tr>
              <tr className="flex justify-center">
                {
                  <td
                    key={perYear.year}
                    className="flex-1 text-center border-r border-gray-400 p-2"
                  >
                    {perYear.data.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between my-2 text-sm"
                      >
                        <div className="w-1/2">{item.account_nm}</div>
                        <div className="w-1/2">
                          {formatNumber(item.thstrm_amount)}
                        </div>
                      </div>
                    ))}
                  </td>
                }
              </tr>
            </div>
            // </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
