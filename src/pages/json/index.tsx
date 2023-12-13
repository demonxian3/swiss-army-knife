import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { JSONEditor } from "vanilla-jsoneditor"
import { useStore } from "@/stores"
import { observer } from "mobx-react-lite"
import { message } from "antd"
import { jsonFormat } from "@/misc/coder"
import "./index.less"

const JsonEditor = () => {
    const [editor, setEditor] = useState<object | null>(null)
    const editorRef = useRef<HTMLDivElement | null>(null)
    const { globalStore: gs } = useStore()

    const formatter = useCallback((data: Record<any, any>) => jsonFormat(JSON.stringify(data)), [])

    const content = useMemo(() => {
        try {
            return { json: JSON.parse(gs.dataSource), text: undefined }
        } catch {
            message.error("Json解析失败，请检查json格式是否有误")

            return { json: undefined, text: undefined }
        }
    }, [gs.dataSource])

    useEffect(() => {
        const editor = new JSONEditor({
            target: editorRef.current as Element,
            props: {
                content,
                onSelect: (selection: any) => {
                    if (selection) {
                        console.log("onSelect", selection)
                        const { type, path } = selection
                        if (["key", "value"].includes(type)) {
                            gs.setJsonSelection({ type, path })
                        } else {
                            gs.setJsonSelection(null)
                        }
                    }
                },
                onChange: (updatedContent, previousContent, { contentErrors, patchResult }) => {
                    console.log("onChange", {
                        updatedContent,
                        previousContent,
                        contentErrors,
                        patchResult,
                    })

                    gs.setDataSource(formatter((updatedContent as any).json))
                },
            },
        })
        console.log(editor)
        setEditor(editor)
    }, [])

    return (
        <div
            className={`h-91vh ${gs.isDarkMode ? "jse-theme-dark" : "jse-theme-light"}`}
            ref={editorRef}
            id="jsonEditor3"
        ></div>
    )
}

export default observer(JsonEditor)
