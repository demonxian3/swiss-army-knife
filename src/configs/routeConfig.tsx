// 请勿直接引用该文件，如需获取路由，请通过 import { routes } from '@/router/routes' 获取
import { RouteObject } from "react-router-dom"
import Base from "@/layouts/base/index"
import Home from "@/pages/home/index"
// import JsonEditor from "@/pages/jsonEditor/index"
import JsonEditor from "@/pages/json/index"
import NotFound from "@/pages/error/notFound"

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Base />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/json",
                element: <JsonEditor />,
            },
           
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]

export default routes
