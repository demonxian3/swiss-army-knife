import { useState, useMemo, ReactElement, useRef } from "react"
import { Button, Typography, message } from "antd"
import { tools } from "@/misc/index"
import { chain, omit, last, get, set } from "lodash"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { useI18n } from "@/i18n"
import "./index.less" // 样式文件可以自定义
import { PicLeftOutlined, PicRightOutlined } from "@ant-design/icons"
import { useWindowSize } from "react-use"
import { useLocation } from "react-router-dom"
import { isString, isNumber } from "lodash"

// const randomHue = Math.floor(Math.random() * 360)
const Toolbox = () => {
    const [activeTool, setActiveTool] = useState("coder")
    const [settingDom, setSettingDom] = useState<ReactElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const { globalStore: gs } = useStore()
    const { t, translateToolLabel } = useI18n()
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
    const isDiffArea = location.pathname === "/diff"

    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!gs.toolBoxExpand || !wrapperRef.current) {
            return
        }

        event.preventDefault()
        const panelLeft = wrapperRef.current.getBoundingClientRect().left

        const handleMouseMove = (moveEvent: MouseEvent) => {
            gs.setToolboxWidth(moveEvent.clientX - panelLeft, isLaptop)
        }

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
    }

    // 编辑器界面
    const handleDataArea = (handler: Function, label: string) => {
        const previousText = gs.dataSource
        // 由编辑器API修改 dataSource
        gs.dataSourceUpdater(handler)
        if (isDataArea) {
            setTimeout(() => {
                gs.commitHistorySnapshot(gs.dataSource, label, previousText)
            }, 1)
        }
    }

    // Json编辑器
    const handleJsonArea = (handler: Function, label: string) => {
        if (!gs.jsonSelection) {
            throw new Error(t("toolbox.noJsonSelection"))
        }

        let obj = null
        const previousText = gs.dataSource
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
                throw new Error(t("toolbox.onlyStringNumber"))
            }
            const inp = isString(val) ? val : val.toString()
            obj = set(jsonData, path, handler(inp))
        } else {
            throw new Error(`${t("toolbox.unknownType")}: ${gs.jsonSelection.type}`)
        }

        // 增加历史记录
        const res = JSON.stringify(obj, null, 4)
        gs.setDataSource(res)
        gs.commitHistorySnapshot(res, label, previousText)
    }

    // 二阶函数
    const handleCoding =
        (item: { label: string; handler: Function; helper?: Function; configurable: boolean }) =>
        () => {
            try {
                const translatedItem = { ...item, label: translateToolLabel(item.label) }

                // 显示配置界面
                if (item?.configurable) {
                    item.handler(setSettingDom, handleCoding, translatedItem, isLaptop)
                    return
                } else {
                    setSettingDom(null)
                }

                if (isDataArea || isDiffArea) {
                    handleDataArea(item.handler, translatedItem.label)
                } else if (isJsonArea) {
                    handleJsonArea(item.handler, translatedItem.label)
                }
            } catch (e: any) {
                console.error(e)
                message.error(e.toString())
            }
        }

    return (
        <div className={`relative h-full`} style={{ transition: "width 0.3s ease-in-out" }}>
            <div
                ref={wrapperRef}
                className={`toolbox shadow flex relative ${gs.isDarkMode ? "toolbox-dark" : "toolbox-light"}`}
                style={gs.getToolboxWidthStyle(isLaptop)}
            >
                <div className="toolbox-rail h-full">
                    <button
                        onClick={() => gs.toggleToolExpand()}
                        className="toolbox-toggle panel-toggle-button"
                    >
                        {gs.toolBoxExpand ? <PicLeftOutlined /> : <PicRightOutlined />}
                    </button>
                    {buildToolBtn("coder", t("toolbox.coder"))}
                    {buildToolBtn("crypter", t("toolbox.crypter"))}
                    {/* {buildToolBtn("convert", "格式转换")} */}
                    {/* {buildToolBtn("other", "杂项功能")} */}
                    {/* {buildToolBtn("formatter", "格式排版")} */}
                </div>
                <div className="toolbox-content w-full">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <td>
                                    <Typography className="text-gray-500 font-bold">
                                        {t("common.toolbox")}
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
                                                    {translateToolLabel(item.label)}
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
                {gs.toolBoxExpand && <div className="toolbox-resize-handle" onMouseDown={handleResizeStart} />}
            </div>
        </div>
    )
}

export default observer(Toolbox)
