import { createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/main/MainPage";
import PostDetail from "./routes/postDetail/PostDetailPage";
import MyPage from "./routes/my/MyPage";
import EditorPage from "./routes/editor/EditorPage";
import Search from "./components/search/Search"
import PostEditPage from "./routes/postEdit/PostEditPage";

import Info from "./components/info/info";
import Layout from "./components/Layout";
// import LoginModal from "./components/login/LoginModal";
import Redirect from "./components/login/Redirect";
import ScrapPage from "./routes/scrap/ScrapPage";
import NotFoundPage from "./routes/notFound/NotFoundPage";

const routers = [
  {
    path: "/",
    element: <MainPage />,
    // index: true
  },
  {
    path: "/my",
    element: <Layout />,
    // index: true
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
    // index: true
  },
  {
    path: "/post",
    element: <Layout />,
    // index: true
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
      }
    ],
  },
  // {
  //   path: "/kakao/auth",
  //   element: <LoginModal isOpen={true} onRequestClose={() => false} />,
  // },
  {
    path: "/kakao/api/login",
    element: <Redirect />,
  },
  {
    path:"/search",
    element: <Search />,
  },
  {
    
    path: "/edit/:id",
    element: <PostEditPage />
  },
  {
    path:"/info",
    element:<Info/>
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

const router = createBrowserRouter(routers);

export default router;
