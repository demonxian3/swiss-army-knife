import { useState } from "react"
import { Flex, Button } from "antd"
import { RobotOutlined } from "@ant-design/icons"
import buttonConfig from "./config"
import { chain } from "lodash"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import "./index.less" // 样式文件可以自定义

// const randomHue = Math.floor(Math.random() * 360)
const Toolbox = () => {
    const [activeTool, setActiveTool] = useState("coder")
    const { globalStore } = useStore()

    const ExpandBtn = (className: string) => (
        <button
            className={`w-26px bg-light-blue-500 text-white shadow text-xl ${className}`}
            onClick={() => globalStore.toggleExpand()}
        >
            <RobotOutlined />
        </button>
    )

    const buildToolBtn = (key: string, label: string) => {
        return (
            <button
                className={`${key}-button ${activeTool === key && "active"}`}
                onClick={() => globalStore.toolBoxExpand && setActiveTool(key)}
            >
                {label}
            </button>
        )
    }

    return (
        <div
            className={`relative h-full ${globalStore.toolBoxExpand ? "w-auto" : "min-w-20px"}`}
            style={{ transition: "width 0.3s ease-in-out" }}
        >
            <div
                className={`toolbox shadow flex relative ${
                    globalStore.toolBoxExpand ? "expanded" : "collapsed"
                }`}
                // style={{
                //     background: `linear-gradient(to left bottom, hsl(${randomHue}, 100%, 85%) 0%, hsl(${
                //         (randomHue + 106) % 360
                //     }, 100%, 85%) 100%)`,
                // }}
            >
                <div className="w-28px h-full">
                    {ExpandBtn("")}
                    {buildToolBtn("coder", "编码解码")}
                    {buildToolBtn("crypt", "加密解密")}
                    {buildToolBtn("other", "杂项功能")}
                    {buildToolBtn("format", "格式排版")}
                </div>
                <div className="">
                    <Flex wrap="wrap" gap="small" className="mt-1 ml-1">
                        <table>
                            {chain(buttonConfig)
                                .filter((btn: any) => btn.type === activeTool)
                                .chunk(2)
                                .map((chunk: any) => (
                                    <tr>
                                        {chunk.map((item: any) => (
                                            <td>
                                                <Button
                                                    style={{ fontSize: "12px" }}
                                                    className="w-full"
                                                    size="small"
                                                    type="primary"
                                                    ghost
                                                >
                                                    {item.label}
                                                </Button>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                .value()}
                        </table>
                    </Flex>
                </div>
            </div>
            {!globalStore.toolBoxExpand && ExpandBtn("absolute top-0")}
        </div>
    )
}

export default observer(Toolbox)
