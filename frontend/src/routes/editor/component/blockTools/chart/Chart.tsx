import ReactApexChart from "react-apexcharts";
import { stockResp } from "./ChartBlock";
import { ApexOptions } from "apexcharts";

// 날짜 포맷 변환 함수 (예시)
function formatDate(dateStr: string) {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
}

interface chartProps {
  stockData: stockResp;
}

function JsonChartTest({ stockData }: chartProps) {
  if (Object.keys(stockData).length === 0) {
    return <div>No data available</div>;
  }

  const formattedDataForCandle = stockData.data
    .map((item: any) => {
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
    .filter((data: any) => data !== null); // 유효하지 않은 데이터를 제거

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
        colors: {
          upward: "#FF0000",
          downward: "#0000FF",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  return (
    <ReactApexChart
      id="chartTarget"
      options={options as ApexOptions}
      series={series as ApexOptions["series"]}
      type="candlestick"
      height={350}
    />
  );
}

export default JsonChartTest;
