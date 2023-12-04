import { useState, useMemo } from "react"
import { Flex, Button, Typography, message } from "antd"
import buttonConfig from "./coder"
import { chain } from "lodash"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import "./index.less" // 样式文件可以自定义
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import { useWindowSize } from "react-use"

// const randomHue = Math.floor(Math.random() * 360)
const Toolbox = () => {
    const [activeTool, setActiveTool] = useState("coder")
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const buildToolBtn = (key: string, label: string) => {
        return (
            <button
                className={`${key}-button ${activeTool === key && "active"}`}
                onClick={() => gs.toolBoxExpand && setActiveTool(key)}
            >
                {label}
            </button>
        )
    }

    const handleCoding = (item: { label: string; handler: Function }) => () => {
        try {
            const res = item.handler(gs.data)
            gs.setData(res, item.label)
        } catch (e: any) {
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
                    {buildToolBtn("crypt", "加密解密")}
                    {buildToolBtn("other", "杂项功能")}
                    {buildToolBtn("format", "格式排版")}
                </div>
                <div className="">
                    <table>
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
                            {chain(buttonConfig)
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
                </div>
            </div>
        </div>
    )
}

export default observer(Toolbox)
