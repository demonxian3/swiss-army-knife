import { Layout, Menu } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/index"
import { useNavigate, useLocation } from "react-router-dom"
import headerConfig from "@/configs/headerConfig"
import "./index.less"

const { Header } = Layout

const HeaderComponent = () => {
    const { globalStore } = useStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavigate = (item: any) => {
        if (["light", "dark"].includes(item.key)) {
            globalStore.changeTheme(item.key)
        } else {
            navigate(`/${item.key}`)
        }
    }


    return (
        <Header className="header">
            <div className="logo">SAK</div>
            <Menu
                className="font-mono"
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname.slice(1)]}
                items={headerConfig}
                onClick={handleNavigate}
            />
            {/* <div className="float-right">ProjectName</div> */}
        </Header>
    )
}

export default observer(HeaderComponent)
