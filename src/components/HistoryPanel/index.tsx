import { useMemo } from "react"
import { List, Typography, Space, Tooltip } from "antd"
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

const data = [
    {
        title: "粘贴数据 " + dayjs().format("hh:mm:ss"),
    },
    {
        title: " Url解码 " + dayjs().format("hh:mm:ss"),
    },
    {
        title: " Unicode编码 " + dayjs().format("hh:mm:ss"),
    },
    {
        title: " 邮件编码 " + dayjs().format("hh:mm:ss"),
    },
]
// const randomHue = Math.floor(Math.random() * 360)
const HistoryPanel = () => {
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])
    return (
        <div className={`h-full history-panel ${gs.getHistoryWidth(isLaptop)}`}>
            <List
                header={
                    <Space>
                        <button
                            onClick={() => gs.toggleHistoryExpand()}
                            className={`w-26px text-yellow-600 text-white text-xl `}
                        >
                            {gs.historyExpand ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </button>
                        <Typography className="text-gray-500 font-bold">操作历史</Typography>
                    </Space>
                }
                size="small"
                className={`!text-12px ${isLaptop ? "w-280px" : "w-320px"} `}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <div className={`flex justify-between w-full`}>
                                    <Typography className="truncate w-10vw ">
                                        {item.title}
                                    </Typography>
                                    <Space>
                                        <Tooltip title="收藏">
                                            <PlusCircleOutlined className="text-16px text-yellow-500 cursor-pointer" />
                                        </Tooltip>
                                        <Tooltip title="拷贝">
                                            <CopyrightOutlined className="text-16px  text-blue-500 cursor-pointer" />
                                        </Tooltip>
                                        <Tooltip title="删除">
                                            <CloseCircleOutlined className="text-16px text-rose-500 cursor-pointer" />
                                        </Tooltip>
                                    </Space>
                                </div>
                            }
                            description={
                                <div className={`ellipsis`}>
                                    dsaddsadsadsa的撒打算打算啊sadsadsadsa的撒打打算打算啊sadsadsadsa的撒打算打算打算啊dsadsadsa的撒打算打算啊dsa的撒打算打算啊
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default observer(HistoryPanel)
