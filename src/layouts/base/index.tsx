import { Layout, Card } from "antd"
import { observer } from "mobx-react-lite"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Header, Sider } from "@/layouts/index"

const { Content } = Layout

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
                <Content className="h-full">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default observer(ContentLoader)
