import { useMemo } from "react"
import { useStore } from "@/stores"
import { useI18n } from "@/i18n"
import { Input } from "antd"
import { observer } from "mobx-react-lite"
import { useWindowSize } from "react-use"
import "./index.less"

const DataArea = () => {
    const { globalStore: gs } = useStore()
    const { t } = useI18n()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData?.getData("Text")
        gs.addHistoryItem(data, t("common.pastedText"))
    }

    return (
        <Input.TextArea
            onPaste={handlePaste}
            onChange={(e) => gs.setDataSource(e.target.value)}
            className={`${isLaptop ? "text-size-14px" : "text-size-16px"} data-area break-all w-full !h-full ${gs.isDarkMode ? "data-theme-dark" : "data-theme-light"}`}
            value={gs.dataSource}
        />
    )
}

export default observer(DataArea)
