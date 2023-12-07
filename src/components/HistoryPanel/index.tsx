import { useEffect, useMemo } from "react"
import { List, Typography, Space, Tooltip, message } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CopyrightOutlined,
    PlusCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons"
import { useWindowSize } from "react-use"
import dayjs from "dayjs"

import "./index.less" // 样式文件可以自定义

// TODO 收藏，搜索
const HistoryPanel = () => {
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const handleRollback = (item: { text: string }, idx: number) => {
        gs.setHistoryActiveKey(idx)
        gs.setDataSource(item.text)
    }

    const handleCopy = (e: React.MouseEvent, text: string) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text).then(() => {
            message.success("拷贝成功")
        })
    }

    const handleDelete = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation()
        gs.delHistoryItem(idx)
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

    // TODO 不加上此代码点击触发handleRollback样式不会更新！
    useEffect(() => {}, [gs.historyActiveKey])

    return (
        <div className={`h-full history-panel  ${gs.getHistoryWidth(isLaptop)}`}>
            <Space className={`!text-12px ${isLaptop ? "w-280px" : "w-320px"}`}>
                <button
                    onClick={() => gs.toggleHistoryExpand()}
                    className={`w-26px text-red-600 text-white text-xl `}
                >
                    {gs.historyExpand ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                <Typography className="text-gray-500 font-bold">操作历史</Typography>
            </Space>
            <div className={` h-95/100 overflow-x-hidden overflow-y-scroll history-scroll`}>
                <List
                    size="small"
                    className={`!text-12px ${isLaptop ? "w-280px" : "w-320px"}`}
                    itemLayout="horizontal"
                    dataSource={gs.historyStack}
                    renderItem={(item, idx) => (
                        <List.Item
                            key={idx}
                            style={getItemStyle(idx)}
                            onClick={() => handleRollback(item, idx)}
                        >
                            <List.Item.Meta
                                title={
                                    <div className={`flex justify-between w-full `}>
                                        <Typography className="truncate w-10vw  text-blue-500">
                                            <Tooltip
                                                title={dayjs(item.time).format(
                                                    "YYYY-MM-DD HH:mm:ss",
                                                )}
                                            >
                                                {dayjs(item.time).format("mm:ss")}
                                            </Tooltip>{" "}
                                            {item.label}
                                        </Typography>
                                        <Space>
                                            <Tooltip title="收藏">
                                                <PlusCircleOutlined className="text-16px text-yellow-500 cursor-pointer" />
                                            </Tooltip>
                                            <Tooltip title="拷贝">
                                                <CopyrightOutlined
                                                    onClick={(e) => handleCopy(e, item.text)}
                                                    className="text-16px  text-blue-500 cursor-pointer"
                                                />
                                            </Tooltip>
                                            <Tooltip title="删除">
                                                <CloseCircleOutlined
                                                    onClick={(e) => handleDelete(e, idx)}
                                                    className="text-16px text-rose-500 cursor-pointer"
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
