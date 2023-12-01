import { useState } from "react"
import { Flex, Button } from "antd"
import { RobotOutlined } from "@ant-design/icons"

import "./index.less" // 样式文件可以自定义
const randomHue = Math.floor(Math.random() * 360)
const Sidebar = () => {
    const [isExpanded, setExpanded] = useState(true)
    const [activeTool, setActiveTool] = useState("coder")

    const toggleSidebar = () => {
        setExpanded(!isExpanded)
    }

    const ExpandBtn = (className: string) => (
        <button
            className={`w-26px bg-light-blue-500 text-white shadow text-xl ${className}`}
            onClick={toggleSidebar}
        >
            <RobotOutlined />
        </button>
    )

    const buildToolBtn = (key: string, label: string) => {
        return (
            <button
                className={`${key}-button ${activeTool === key && "active"}`}
                onClick={() => setActiveTool(key)}
            >
                {label}
            </button>
        )
    }

    return (
        <div
            className={`relative h-full ${isExpanded ? "w-auto" : "min-w-20px"}`}
            style={{ transition: "width 0.3s ease-in-out" }}
        >
            <div
                className={`sidebar shadow flex relative ${isExpanded ? "expanded" : "collapsed"}`}
                style={{
                    background: `linear-gradient(to left bottom, hsl(${randomHue}, 100%, 85%) 0%, hsl(${
                        (randomHue + 106) % 360
                    }, 100%, 85%) 100%)`,
                }}
            >
                <div className="w-28px h-full">
                    {ExpandBtn("")}
                    {buildToolBtn("coder", "编码解码")}
                    {buildToolBtn("crypt", "加密解密")}
                    {buildToolBtn("other", "杂项功能")}
                    {buildToolBtn("format", "格式排版")}
                </div>
                <div className="">
                    <Flex wrap="wrap" gap="small" className="mt-2 ml-2 w-200px">
                        {Array.from({ length: 24 }, (_, i) => (
                            <Button key={i} ghost type="primary">
                                Button
                            </Button>
                        ))}
                    </Flex>
                </div>
            </div>
            {!isExpanded && ExpandBtn("absolute top-0")}
        </div>
    )
}

export default Sidebar
