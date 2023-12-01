import React from "react"
import { Space } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { DataArea, ToolBox } from "@/components"

const App: React.FC = () => {
    const { globalStore } = useStore()
    console.log(globalStore.localeKey)
    return (
        <Space className="items-stretch h-full">
            <ToolBox />
            <DataArea />
        </Space>
    )
}

export default observer(App)
