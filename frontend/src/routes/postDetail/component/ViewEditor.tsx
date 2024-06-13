// import React from 'react'
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { NewsBlock } from "../../editor/component/blockTools/news/NewsBlock";

const dummyData = {
  time: 1718069579642,
  blocks: [
    {
      id: "l98dyx3yjb",
      type: "header",
      data: {
        text: "Header예시",
        level: 1,
      },
    },
    {
      id: "1yKeXKxN7-",
      type: "header",
      data: {
        text: "header level3",
        level: 3,
      },
    },
    {
      id: "lasjflasjfl",
      type: "news",
      data: {
        detail:
          "중국 최대 통신장비업체 화웨이가 9월 출시 예정인 인공지능(AI) 칩 성능이 미국 엔비디아의 최신작 H200에 필적할 것으로 보인다고 중국시보 등 대만언론이 12일 보도했다. 보도에 따르면 한 소식통은 화웨이가 7㎚",
        imgUrl:
          "https://imgnews.pstatic.net/image/011/2024/06/12/0004352292_001_20240612162612344.png?type=w800",
        newsUrl: "https://n.news.naver.com/mnews/article/011/0004352292",
        title:
          '대만언론 "곧 출시되는 화웨이 AI칩, 엔비디아 최신작 H200에 필적"',
      },
    },
  ],
};

export default function ViewEditor() {
  new EditorJS({
    holder: "viewEditor",
    readOnly: true,
    data: dummyData,
    tools: {
      header: Header,
      news: NewsBlock,
    },
  });

  return <div id="viewEditor"></div>;
}
