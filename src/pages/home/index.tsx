import React from "react"
import { Space } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
// import { DataArea } from "@/components"
import CodeArea  from "@/pages/code/index"

const App: React.FC = () => {
    const { globalStore } = useStore()
    console.log(globalStore.localeKey)
    return <CodeArea />
}

export default observer(App)
