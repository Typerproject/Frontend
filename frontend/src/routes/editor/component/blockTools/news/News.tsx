import React, { useState } from "react";
import { INewsData } from "./NewsBlock";
import editorAPI from "../../../../../api/editorAPI";

const service = new editorAPI(import.meta.env.VITE_SERVER_EDITOR_API_URI);

type StockNewsProps = {
  newsData: INewsData;
  setNewsData: (data: INewsData) => void;
};

const StockNews: React.FC<StockNewsProps> = ({ newsData, setNewsData }) => {
  // export default function StockNews({ newsData, setNewsData }: StockNewsProps) {
  const [newsInfo, setNewsInfo] = useState<INewsData>(newsData);
  console.log("newsInfo", newsInfo);

  const handlePaste = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const url = e.target.value;
    try {
      const resp = await service.getNewsData(url);
      console.log(resp);
      setNewsInfo(resp.data);
      setNewsData(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!newsInfo || Object.keys(newsInfo).length === 0) {
    return (
      <input
        className="w-full border border-gray-400	rounded-md p-[0.5rem]"
        placeholder="기사의 url을 붙여넣어 주세요!"
        onChange={(e) => handlePaste(e)}
      />
    );
  }

  return (
    <div 
    onClick={()=> window.open(newsInfo.newsUrl)}
    className="border border-gray-300 rounded-md p-[0.75rem] grid grid-cols-7 max-w-[100%] cursor-pointer my-[1rem]">
      <div className="col-[1/6]">
        <p className="font-semibold	mb-[5px]">{newsInfo.title}</p>
        <p className="text-sm ">{newsInfo.detail}</p>
        <p className="text-sm	text-gray-500">{newsInfo.newsUrl}</p>
      </div>
      <div className="col-[6/8] bg-cover bg-center ml-[5px]"
      style={{ backgroundImage: `url(${newsInfo.imgUrl})` }}
      >
      </div>
    </div>
  );
};

export default StockNews;
