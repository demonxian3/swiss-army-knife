import { Layout, Card } from "antd"
import { observer } from "mobx-react-lite"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Header } from "@/layouts/index"
import { ToolBox, HistoryPanel } from "@/components"
import { Space } from "antd"
const { Content, Sider } = Layout

const ContentLoader = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        // 默认路由
        if (!location.pathname || location.pathname === "/") {
            navigate("/home")
        }
    }, [])

    return (
        <Layout className="h-full">
            <Header />
            <Layout>
                <Sider width="auto" theme="light">
                    <ToolBox />
                </Sider>
                <Content className="h-full">
                    {/* <Space className="items-stretch h-full"> */}
                    <Outlet />
                    {/* </Space> */}
                </Content>
                <Sider theme="light" width="auto">
                    <HistoryPanel />
                </Sider>
            </Layout>
        </Layout>
    )
}

export default observer(ContentLoader)
