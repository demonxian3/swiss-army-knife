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

    const getAreaData = useCallback(() => {
        if (isDataArea) {
            return gs.data
        }

        if (isJsonArea) {
            if (!gs.jsonSelection) {
                throw new Error("当前Json编辑器没有选中要修改的值，无法操作")
            }

            const jsonData = JSON.parse(gs.dataSource)

            if (gs.jsonSelection.type === "key") {
                return last(gs.jsonSelection.path)
            } else if (gs.jsonSelection.type === "value") {
                const value = get(jsonData, gs.jsonSelection.path)
                if (![isNumber, isString].some((fn) => fn(value))) {
                    throw new Error("当前仅支持对字符串和数字类型的值进行操作")
                }

                return value
            }
        }

        return ""
    }, [location.pathname, gs.jsonSelection])

    const setAreaData = useCallback(
        (text: string) => {
            if (isDataArea) {
                return gs.setData(text)
            }

            if (isJsonArea) {
                if (!gs.jsonSelection) {
                    throw new Error("当前Json编辑器没有选中要修改的值，无法操作")
                }

                const jsonData = JSON.parse(gs.dataSource)
                const value = get(jsonData, gs.jsonSelection.path)

                if (gs.jsonSelection.type === "key") {
                    // 设置新的key
                    const newPath = gs.jsonSelection.path.slice()
                    newPath[newPath.length - 1] = text

                    const newObj = set(omit(jsonData, gs.jsonSelection.path), newPath, value)
                    const newVal = JSON.stringify(newObj, null, 4)

                    gs.setJsonSelection({ ...gs.jsonSelection, path: newPath })
                    gs.setDataSource(newVal)
                    return newVal
                } else if (gs.jsonSelection.type === "value") {
                    const newObj = set(jsonData, gs.jsonSelection.path, text)
                    const newVal = JSON.stringify(newObj, null, 4)

                    gs.setDataSource(newVal)
                    return text
                }
            }

            return ""
        },
        [location.pathname, gs.jsonSelection],
    )

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
                const res = item.handler(getAreaData())

                // 当历史为空，将初始数据作为历史记录首条
                if (!gs.historyStack.length) {
                    gs.addHistoryItem(gs.dataSource, "初始数据")
                }

                // 更新mobx值
                const text = setAreaData(res)
                // 增加历史记录
                gs.addHistoryItem(text, item.label)
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
                    {/* {buildToolBtn("other", "杂项功能")}
                    {buildToolBtn("formatter", "格式排版")} */}
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
