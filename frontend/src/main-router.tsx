import { createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/main/MainPage";
import PostDetail from "./routes/postDetail/PostDetailPage";
import MyPage from "./routes/my/MyPage";
import EditorPage from "./routes/editor/EditorPage";

import Layout from "./components/Layout";
import LoginModal from "./components/login/LoginModal";
import Redirect from "./components/login/Redirect";

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
        path: "",
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
        path: "",
        element: <PostDetail />,
        index: true,
      },
    ],
  },
  {
    path: "/auth",
    element: <LoginModal isOpen={true} onRequestClose={() => false} />,
  },
  {
    path: "/kakao/login",
    element: <Redirect />,
  },
];

const router = createBrowserRouter(routers);

export default router;
