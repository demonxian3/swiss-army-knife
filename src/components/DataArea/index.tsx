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

    // const handleSelect = () => {
    //     const textarea = document.activeElement as HTMLTextAreaElement

    //     if (!textarea || !textarea.value) {
    //         return
    //     }

    //     const { selectionStart, selectionEnd } = textarea

    //     const content =
    //         selectionEnd <= selectionStart
    //             ? ""
    //             : textarea.value.substring(selectionStart, selectionEnd)

    //     gs.setSelection(selectionStart, selectionEnd, textarea, content)
    // }

    return (
        <Input.TextArea
            // onMouseUp={handleSelect}
            // onMouseLeave={handleSelect}
            onPaste={handlePaste}
            onChange={(e) => gs.setDataSource(e.target.value)}
            className={`${isLaptop ? "text-size-14px" : "text-size-16px"} break-all w-full !h-full`}
            value={gs.dataSource}
        />
    )
}

export default observer(DataArea)
