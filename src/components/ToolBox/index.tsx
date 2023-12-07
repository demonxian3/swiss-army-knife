import { useState, useMemo, ReactElement } from "react"
import { Divider, Button, Typography, message } from "antd"
import { tools } from "@/misc/index"
import { chain } from "lodash"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import "./index.less" // 样式文件可以自定义
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import { useWindowSize } from "react-use"

// const randomHue = Math.floor(Math.random() * 360)
const Toolbox = () => {
    const [activeTool, setActiveTool] = useState("crypter")
    const [settingDom, setSettingDom] = useState<ReactElement | null>(null)
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const buildToolBtn = (key: string, label: string) => {
        return (
            <button
                className={`${key}-button ${activeTool === key && "active"}`}
                onClick={() => {
                    setActiveTool(key)
                    setSettingDom(null)
                    !gs.toolBoxExpand && gs.toggleToolExpand()
                }}
            >
                {label}
            </button>
        )
    }

    // 二阶函数
    const handleCoding =
        (item: { label: string; handler: Function; helper?: Function; configurable: boolean }) =>
        () => {
            try {
                // 显示配置界面
                if (item?.configurable) {
                    item.handler(setSettingDom, handleCoding, item, isLaptop)
                    return
                } else {
                    setSettingDom(null)
                }

                // 触发方法（纯函数？）
                const res = item.handler(gs.data)

                // 更新mobx值
                gs.setData(res, item.label)
            } catch (e: any) {
                console.error(e)
                message.error(e.toString())
            }
        }

    return (
        <div className={`relative h-full`} style={{ transition: "width 0.3s ease-in-out" }}>
            <div className={`toolbox shadow flex relative ${gs.getToolboxWidth(isLaptop)}`}>
                <div className="w-28px h-full">
                    <button
                        onClick={() => gs.toggleToolExpand()}
                        className={`w-26px text-blue-600 text-white text-xl `}
                    >
                        {gs.toolBoxExpand ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </button>
                    {buildToolBtn("coder", "编码解码")}
                    {buildToolBtn("crypter", "加密解密")}
                    {buildToolBtn("other", "杂项功能")}
                    {buildToolBtn("formatter", "格式排版")}
                </div>
                <div className="w-full">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td>
                                    <Typography className="text-gray-500 font-bold">
                                        工具箱
                                    </Typography>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {chain(tools)
                                .filter((btn: any) => btn.type === activeTool)
                                .chunk(2)
                                .map((chunk: any, idx: number) => (
                                    <tr key={idx}>
                                        {chunk.map((item: any, idy: number) => (
                                            <td key={`${idx}-${idy}`}>
                                                <Button
                                                    style={{ fontSize: "12px" }}
                                                    className="w-full"
                                                    size={screenWidth <= 1440 ? "small" : "middle"}
                                                    type="primary"
                                                    ghost
                                                    onClick={handleCoding(item)}
                                                >
                                                    {item.label}
                                                </Button>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                .value()}
                        </tbody>
                    </table>
                    {settingDom}
                </div>
            </div>
        </div>
    )
}

export default observer(Toolbox)
