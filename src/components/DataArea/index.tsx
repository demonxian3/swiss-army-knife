import { useMemo } from "react"
import { useStore } from "@/stores"
import { Input } from "antd"
import { observer } from "mobx-react-lite"
import { useWindowSize } from "react-use"

const DataArea = () => {
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData?.getData("Text")
        gs.addHistoryItem(data, "粘贴文本")
    }

    return (
        <Input.TextArea
            id="dataArea"
            onPaste={handlePaste}
            onChange={(e) => gs.setDataSource(e.target.value)}
            className={`${isLaptop ? "text-size-14px" : "text-size-16px"} break-all w-full !h-full`}
            value={gs.dataSource}
        />
    )
}

export default observer(DataArea)
