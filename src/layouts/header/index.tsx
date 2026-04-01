import { Layout, Menu } from "antd"
import { observer } from "mobx-react-lite"
import { useNavigate, useLocation } from "react-router-dom"
import headerConfig from "@/configs/headerConfig"
import { useI18n } from "@/i18n"
import { useStore } from "@/stores"
import "./index.less"

const { Header } = Layout

const HeaderComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useI18n()
    const { globalStore } = useStore()

    const handleNavigate = (item: any) => {
        navigate(`/${item.key}`)
    }
    const items = headerConfig(t)

    return (
        <Header className={`header ${globalStore.isDarkMode ? "header-dark" : "header-light"}`}>
            <div className="logo">SAK</div>
            <Menu
                className="header-menu font-mono"
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
