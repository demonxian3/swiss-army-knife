import { useEffect, useMemo, useRef, useState } from "react"
import { List, Typography, Space, Tooltip, Segmented, Input, message, Flex } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { useI18n } from "@/i18n"
import {
    PicRightOutlined,
    PicLeftOutlined,
    CopyrightOutlined,
    PlusCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons"
import { useWindowSize, useLocalStorage } from "react-use"
import dayjs from "dayjs"

import "./index.less" // 样式文件可以自定义
import { identity, isEqual, orderBy, pullAt } from "lodash"

// TODO 经过实体编码解码后的json会出现无法正常解析
// TODO Base64存在其他字符时无法使用
interface historyItem {
    time: number
    text: string
    label: string
}

const HistoryPanel = () => {
    const { globalStore: gs } = useStore()
    const { t } = useI18n()
    const { width: screenWidth } = useWindowSize()
    const panelRef = useRef<HTMLDivElement | null>(null)
    const [mode, setMode] = useState("history")
    const [keywords, setKeywords] = useState("")
    const [historyStorage, setHistoryStorage] = useLocalStorage<historyItem[]>("historyStorage", [])
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])
    const isHistoryMode = useMemo(() => mode === "history", [mode])

    const handleRollback = (item: { text: string }, idx: number) => {
        gs.setHistoryActiveKey(idx)
        gs.setDataSource(item.text)
    }

    const handleCopy = (e: React.MouseEvent, text: string) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text).then(() => {
            message.success(t("common.copied"))
        })
    }

    const handleCollect = (e: React.MouseEvent, item: historyItem) => {
        e.stopPropagation()
        if (!historyStorage?.some((i) => isEqual(i, item))) {
            setHistoryStorage(historyStorage?.concat(item))
            message.success(t("history.collectSuccess"))
        }
    }

    const handleDelete = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation()
        if (isHistoryMode) {
            gs.delHistoryItem(idx)
        } else {
            const list = historyStorage?.slice()
            list?.splice(idx, 1)
            setHistoryStorage(list)
        }
    }

    const getItemStyle = (idx: number) => {
        const isLight = gs.themeTag === "light"
        const isActive = idx === gs.historyActiveKey
        const isBeforeActive = idx < gs.historyActiveKey

        let backgroundColor = "unset"

        if (isActive) {
            backgroundColor = isLight ? "#bae0ff" : "#253e67"
        }

        if (isBeforeActive) {
            backgroundColor = isLight ? "#e6f4ff" : "rgb(17, 26, 44)"
        }

        return { backgroundColor }
    }

    const getDataSource = useMemo(() => {
        const searchFn = keywords
            ? (item: historyItem) =>
                `${dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")}${item.label}${item.text
                    }`.includes(keywords)
            : identity

        return isHistoryMode
            ? gs.historyStack.filter(searchFn)
            : orderBy(historyStorage?.filter(searchFn), ["time"], ["desc"])
    }, [isHistoryMode, keywords, gs.historyStack, historyStorage])

    const getTooltipContainer = () => panelRef.current || document.body
    const listWidthClass = isLaptop ? "w-280px" : "w-320px"

    // TODO 不加上此代码点击触发handleRollback样式不会更新！
    useEffect(() => { }, [gs.historyActiveKey])

    return (
        <div
            ref={panelRef}
            className={`h-full history-panel ${gs.isDarkMode ? "history-panel-dark" : "history-panel-light"} ${gs.getHistoryWidth(isLaptop)}`}
        >
            {!gs.historyExpand && (
                <button
                    onClick={() => gs.toggleHistoryExpand()}
                    className="panel-toggle-button history-panel-floating-toggle"
                >
                    <PicRightOutlined />
                </button>
            )}

            <div className={`history-panel-inner ${listWidthClass}`}>

                <Flex className="!text-12px mb-2" justify="space-between" align="center">
                    <button
                        onClick={() => gs.toggleHistoryExpand()}
                        className="panel-toggle-button history-panel-toggle"
                    >
                        {gs.historyExpand ? <PicLeftOutlined /> : <PicRightOutlined />}
                    </button>
                    <Typography className="ml-2 history-panel-title">{t("common.operationHistory")}</Typography>
                    <Segmented
                        className="history-panel-segmented"
                        value={mode}
                        onChange={setMode as any}
                        size="small"
                        options={[
                            { label: t("common.history"), value: "history" },
                            { label: t("common.favorites"), value: "collect" },
                        ]}
                    />
                </Flex>
                <Input
                    className="history-panel-search"
                    size="small"
                    onChange={(e) => setKeywords(e.target.value)}
                    value={keywords}
                    placeholder={t("common.searchKeyword")}
                />
            </div>
            <div className={`history-scroll history-panel-list ${listWidthClass}`}>
                <List
                    size="small"
                    className="!text-12px"
                    locale={{ emptyText: <div className="history-empty-state">{t("history.empty")}</div> }}
                    itemLayout="horizontal"
                    dataSource={getDataSource}
                    renderItem={(item, idx) => (
                        <List.Item
                            key={idx}
                            style={getItemStyle(idx)}
                            onClick={() => handleRollback(item, idx)}
                        >
                            <List.Item.Meta
                                title={
                                    <div className="history-item-title">
                                        <Typography className="history-item-label truncate text-blue-500">
                                            <Tooltip
                                                getPopupContainer={getTooltipContainer}
                                                title={dayjs(item.time).format(
                                                    "YYYY-MM-DD HH:mm:ss",
                                                )}
                                            >
                                                {dayjs(item.time).format("HH:mm")}
                                            </Tooltip>{" "}
                                            {item.label}
                                        </Typography>
                                        <Space className="history-item-actions" size={6}>
                                            {isHistoryMode &&
                                                !historyStorage?.some((i) => isEqual(i, item)) && (
                                                    <Tooltip
                                                        title={t("common.collect")}
                                                        placement="top"
                                                        getPopupContainer={getTooltipContainer}
                                                    >
                                                        <PlusCircleOutlined
                                                            onClick={(e) => handleCollect(e, item)}
                                                            className="history-action-icon"
                                                        />
                                                    </Tooltip>
                                                )}

                                            <Tooltip
                                                title={t("common.copy")}
                                                placement="top"
                                                getPopupContainer={getTooltipContainer}
                                            >
                                                <CopyrightOutlined
                                                    onClick={(e) => handleCopy(e, item.text)}
                                                    className="history-action-icon"
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                title={t("common.delete")}
                                                placement="top"
                                                getPopupContainer={getTooltipContainer}
                                            >
                                                <CloseCircleOutlined
                                                    onClick={(e) => handleDelete(e, idx)}
                                                    className="history-action-icon"
                                                />
                                            </Tooltip>
                                        </Space>
                                    </div>
                                }
                                description={<div className={`ellipsis`}>{item.text}</div>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default observer(HistoryPanel)
