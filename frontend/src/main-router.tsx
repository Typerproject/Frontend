import { createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/main/MainPage";
import PostDetail from "./routes/postDetail/PostDetailPage";
import MyPage from "./routes/my/MyPage";
import EditorPage from "./routes/editor/EditorPage";

const routers = [
    {
        path: "/",
        element: <MainPage />,
        // index: true
    }, 
    {
        path: "/my",
        element: <MyPage />,
        // index: true
    },
    {
        path: "/editor",
        element: <EditorPage />,
        // index: true
    },
    {
        path: "/post",
        element: <PostDetail />,
        // index: true
    }
];

const router = createBrowserRouter(routers);

export default router;