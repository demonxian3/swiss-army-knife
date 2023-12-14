import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { JSONEditor } from "vanilla-jsoneditor"
import { useStore } from "@/stores"
import { observer } from "mobx-react-lite"
import { message } from "antd"
import { jsonFormat } from "@/misc/coder"
import "./index.less"
import { useUpdateEffect } from "ahooks"
import { isEqual } from "lodash"

const JsonEditor = () => {
    const [editor, setEditor] = useState<any | null>(null)
    const editorRef = useRef<HTMLDivElement | null>(null)
    const { globalStore: gs } = useStore()

    const formatter = useCallback((data: Record<any, any>) => jsonFormat(JSON.stringify(data)), [])

    const content = useMemo(() => {
        try {
            return { json: JSON.parse(gs.dataSource), text: undefined }
        } catch {
            message.error("Json解析失败，无法加载，请检查json格式是否有误")

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
                        const { type } = selection
                        if (["key", "value"].includes(type)) {
                            gs.setJsonSelection(selection)
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

    // 监听 dataSource ，使用 editor.update的副作用更新jsonEditor的值
    useEffect(() => {
        try {
            if (editor && editor?.get()?.json && gs.dataSource) {
                if (!isEqual(editor?.get()?.json, JSON.parse(gs.dataSource))) {
                    editor.update(content)
                    if (gs.jsonSelection?.type === "key") {
                        editor.select(gs.jsonSelection)
                    }
                    console.log("update", gs.dataSource, content)
                }
            }
        } catch {
        }
    }, [gs.dataSource])

    return (
        <div
            className={`h-91vh ${gs.isDarkMode ? "jse-theme-dark" : "jse-theme-light"}`}
            ref={editorRef}
            id="jsonEditor3"
        ></div>
    )
}

export default observer(JsonEditor)
