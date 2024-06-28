import { createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/main/MainPage";
import PostDetail from "./routes/postDetail/PostDetailPage";
import MyPage from "./routes/my/MyPage";
import EditorPage from "./routes/editor/EditorPage";
import Search from "./components/search/Search";
import PostEditPage from "./routes/postEdit/PostEditPage";

import Info from "./components/info/info";
import Layout from "./components/Layout";
import Redirect from "./components/login/Redirect";
import ScrapPage from "./routes/scrap/ScrapPage";
import NotFoundPage from "./routes/notFound/NotFoundPage";
import SearchPage from "./routes/search/SearchPage";

const routers = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MainPage />,
        index: true,
      },
    ],
  },
  {
    path: "/my",
    element: <Layout />,
    children: [
      {
        path: ":id",
        element: <MyPage />,
        index: true,
      },
    ],
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "/post",
    element: <Layout />,
    children: [
      {
        path: ":id",
        element: <PostDetail />,
        index: true,
      },
      {
        path: "scrap",
        element: <ScrapPage />,
        index: true,
      },
    ],
  },
  {
    path: "/kakao/api/login",
    element: <Redirect />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/edit/:id",
    element: <PostEditPage />,
  },
  {
    path: "/info",
    element: <Info />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routers);

export default router;
