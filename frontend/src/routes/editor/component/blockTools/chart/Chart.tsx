import React from "react";
import ReactApexChart from "react-apexcharts";

// 날짜 포맷 변환 함수 (예시)
function formatDate(dateStr: string) {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}

function JsonChartTest({ stockData }) {
  if (!stockData) {
    return <div>No data available</div>;
  }

  const formattedDataForCandle = stockData.data
    .map((item) => {
      const open = Number(item.open);
      const high = Number(item.high);
      const low = Number(item.low);
      const close = Number(item.close);

      // 모든 값이 유효한 숫자인지 확인하고, 아니면 해당 데이터를 제외
      if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
        console.log(`유효하지 않은 데이터 ${item}`);
        return null;
      }

      return {
        x: new Date(formatDate(item.date)),
        y: [open, high, low, close],
      };
    })
    .filter((data) => data !== null); // 유효하지 않은 데이터를 제거

  const series = [
    {
      data: formattedDataForCandle,
    },
  ];

  const stockTitle = stockData.stockTitle || "국내주식기간별시세";

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: stockTitle,
      align: "left",
      style: {
        fontSize: "30px",
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  return (
    <ReactApexChart
      id="chartTarget"
      options={options}
      series={series}
      type="candlestick"
      height={350}
    />
  );
}

export default JsonChartTest;
