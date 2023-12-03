import React from "react"
import { Space } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { DataArea } from "@/components"

const App: React.FC = () => {
    const { globalStore } = useStore()
    console.log(globalStore.localeKey)
    return <DataArea />
}

export default observer(App)
