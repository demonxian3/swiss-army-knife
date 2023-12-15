import { useState, useMemo, ReactElement, useCallback } from "react"
import { Button, Typography, message } from "antd"
import { tools } from "@/misc/index"
import { chain, omit, last, get, set } from "lodash"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import "./index.less" // 样式文件可以自定义
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import { useWindowSize } from "react-use"
import { useLocation } from "react-router-dom"
import { isString, isNumber } from "lodash"

// const randomHue = Math.floor(Math.random() * 360)
const Toolbox = () => {
    const [activeTool, setActiveTool] = useState("coder")
    const [settingDom, setSettingDom] = useState<ReactElement | null>(null)
    const { globalStore: gs } = useStore()
    const location = useLocation()
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

    const isDataArea = location.pathname === "/home"
    const isJsonArea = location.pathname === "/json"

    // 编辑器界面
    const handleDataArea = (handler: Function, label: string) => {
        // 由编辑器API修改 dataSource
        gs.dataSourceUpdater(handler)
        setTimeout(() => {
            gs.addHistoryItem(gs.dataSource, label)
        }, 1)
    }

    // Json编辑器
    const handleJsonArea = (handler: Function, label: string) => {
        debugger
        if (!gs.jsonSelection) {
            throw new Error("当前Json编辑器没有选中要修改的值，无法操作")
        }

        let obj = null
        const jsonData = JSON.parse(gs.dataSource)
        const val = get(jsonData, gs.jsonSelection.path)
        const path = gs.jsonSelection.path.slice()

        // 对 key 进行修改
        if (gs.jsonSelection.type === "key") {
            path[path.length - 1] = handler(last(path))
            obj = set(omit(jsonData, gs.jsonSelection.path), path, val)
            gs.setJsonSelection({ ...gs.jsonSelection, path: path })
        } else if (gs.jsonSelection.type === "value") {
            if (![isString, isNumber].some((f) => f(val))) {
                throw new Error("目前只支持对数字和字符串类型进行操作")
            }
            const inp = isString(val) ? val : val.toString()
            obj = set(jsonData, path, handler(inp))
        } else {
            throw new Error("未知的type类型: " + gs.jsonSelection.type)
        }

        // 增加历史记录
        const res = JSON.stringify(obj, null, 4)
        gs.setDataSource(res)
        gs.addHistoryItem(res, label)
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

                // 当历史为空，将初始数据作为历史记录首条
                if (!gs.historyStack.length) {
                    gs.addHistoryItem(gs.dataSource, "初始数据")
                }

                if (isDataArea) {
                    handleDataArea(item.handler, item.label)
                } else if (isJsonArea) {
                    handleJsonArea(item.handler, item.label)
                }
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
                        className={`w-26px text-blue-600 text-xl `}
                    >
                        {gs.toolBoxExpand ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </button>
                    {buildToolBtn("coder", "编码解码")}
                    {buildToolBtn("convert", "格式转换")}
                    {buildToolBtn("crypter", "加密解密")}
                    {/* {buildToolBtn("other", "杂项功能")} */}
                    {/* {buildToolBtn("formatter", "格式排版")} */}
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
