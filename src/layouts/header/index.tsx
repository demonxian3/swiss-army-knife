import { Layout, Menu } from "antd"
import { observer } from "mobx-react-lite"
import { useNavigate, useLocation } from "react-router-dom"
import headerConfig from "@/configs/headerConfig"
import { useI18n } from "@/i18n"
import "./index.less"

const { Header } = Layout

const HeaderComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useI18n()

    const handleNavigate = (item: any) => {
        navigate(`/${item.key}`)
    }
    const items = headerConfig(t)

    return (
        <Header className="header">
            <div className="logo">SAK</div>
            <Menu
                className="font-mono"
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.slice(1)]}
                items={items}
                onClick={handleNavigate}
            />
            {/* <div className="float-right">ProjectName</div> */}
        </Header>
    )
}

export default observer(HeaderComponent)
