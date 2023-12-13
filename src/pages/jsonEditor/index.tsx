import { useStore } from "@/stores"
import { useCallback, useMemo, useState } from "react"
import JsonViewer from "react-json-view"
import { jsonFormat } from "@/misc/coder"
import { observer } from "mobx-react-lite"

const JsonEditor = () => {
    const { globalStore: gs } = useStore()

    const formatter = useCallback((data: Record<any, any>) => jsonFormat(JSON.stringify(data)), [])

    const jsonData = useMemo(() => {
        try {
            return JSON.parse(gs.dataSource)
        } catch {
            return {}
        }
    }, [gs.dataSource])

    return (
        <>
            {/* <Segmented
                value={theme}
                options={themeOptions.slice(0).map((i) => ({ name: i, value: i, label: i }))}
                onChange={(e: string) => setTheme(e)}
            /> */}
            <JsonViewer
                style={{ padding: "12px" }}
                src={jsonData}
                collapseStringsAfterLength={88}
                theme={gs.isDarkMode ? "codeschool" : ("inverted" as any)}
                iconStyle={"square"}
                displayObjectSize={true}
                displayDataTypes={false}
                enableClipboard={true}
                quotesOnKeys={false}
                sortKeys={false}
                collapsed={4}
                onEdit={(e: any) => {
                    if (e.new_value == "error") {
                        return false
                    }
                    const text = formatter(e.updated_src)
                    gs.addHistoryItem(text, "Json修改")
                    gs.setDataSource(text)
                }}
                onDelete={(e: any) => {
                    const text = formatter(e.updated_src)
                    gs.addHistoryItem(text, "Json删除")
                    gs.setDataSource(text)
                }}
                onAdd={(e: any) => {
                    if (e.new_value == "error") {
                        return false
                    }
                    const text = formatter(e.updated_src)
                    gs.addHistoryItem(text, "Json新增")
                    gs.setDataSource(text)
                }}
                onSelect={(e: any) => {
                    console.log("select callback", e)
                    console.log(e.namespace)
                }}
            />
        </>
    )
}

export default observer(JsonEditor)
