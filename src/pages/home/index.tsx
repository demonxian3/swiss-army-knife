import React from "react"
import { Card, Typography } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"

const App: React.FC = () => {
    const { globalStore } = useStore()

    console.log(globalStore.localeKey)
    return (
        <Card size="small">
            <Typography>Hello world</Typography>
        </Card>
    )
}

export default observer(App)
