import { Button, Layout, Menu, Space, Tooltip, message } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/index"
import { useNavigate, useLocation } from "react-router-dom"
import headerConfig from "@/configs/headerConfig"
import {
    getInspectedPageHtml,
    getInspectedPageText,
    getInspectedSelection,
    replaceInspectedSelection,
} from "@/misc/inspectedPage"
import "./index.less"

const { Header } = Layout

const HeaderComponent = () => {
    const { globalStore } = useStore()
    const navigate = useNavigate()
    const location = useLocation()

    const loadExternalData = async (loader: () => Promise<string>, label: string) => {
        try {
            const data = await loader()
            if (!data) {
                message.warning("当前页面没有可读取的内容")
                return
            }

            globalStore.setDataSource(data)
            globalStore.addHistoryItem(data, label)
            navigate("/home")
            message.success(`${label}已载入`)
        } catch (error: any) {
            message.error(error?.message || `${label}失败`)
        }
    }

    const handleReplaceSelection = async () => {
        try {
            await replaceInspectedSelection(globalStore.data)
            message.success("已将当前内容回填到页面选区")
        } catch (error: any) {
            message.error(error?.message || "回填页面选区失败")
        }
    }

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
            <Space size={8}>
                <Tooltip title="读取 inspected page 当前选中的文本">
                    <Button size="small" onClick={() => loadExternalData(getInspectedSelection, "读取页面选中")}>
                        读取选中
                    </Button>
                </Tooltip>
                <Tooltip title="读取页面可见文本内容">
                    <Button size="small" onClick={() => loadExternalData(getInspectedPageText, "读取页面文本")}>
                        页面文本
                    </Button>
                </Tooltip>
                <Tooltip title="读取整个页面 HTML">
                    <Button size="small" onClick={() => loadExternalData(getInspectedPageHtml, "读取页面HTML")}>
                        页面HTML
                    </Button>
                </Tooltip>
                <Tooltip title="将当前编辑器内容写回页面选区">
                    <Button size="small" type="primary" ghost onClick={handleReplaceSelection}>
                        替换选中
                    </Button>
                </Tooltip>
            </Space>
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
