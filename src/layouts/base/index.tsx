import { Layout, Card } from "antd"
import { observer } from "mobx-react-lite"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Header, Footer } from "@/layouts/index"

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
        <Layout>
            <Header />
            <Content className="px-50px">
                {/* <Breadcrumb /> */}
                <Layout className=" mt-3">
                    {/* <Sidebar /> */}
                    <Content className="">
                        <Card className="h-680px overflow-y-scroll border border-red">
                            <Outlet />
                        </Card>
                    </Content>
                </Layout>
            </Content>
            <Footer />
        </Layout>
    )
}

export default observer(ContentLoader)
