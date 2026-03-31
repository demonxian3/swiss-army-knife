import { useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { DiffEditor, Monaco } from "@monaco-editor/react"
import { Button, Space, message } from "antd"
import { useStore } from "@/stores"
import { useLocalStorage } from "react-use"
import EditorSetter from "@/components/EditorSetter"
import { addSelectListener } from "@/misc/common"
import {
    ReplaceSelectionResult,
    readPageHtml,
    readPageSelection,
    readPageVisibleText,
    replacePageSelection,
} from "@/misc/devtools"
import "./index.less"

function App() {
    const diffEditorRef = useRef<typeof DiffEditor | null>(null)
    const { globalStore: gs } = useStore()
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")
    const [diffSync, setDiffSync] = useLocalStorage<number>("editor-sync", 0) // noSync:0 syncLeft:1 syncRight:2

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        diffEditorRef.current = editor
        const originalEditor = editor.getOriginalEditor()
        const modifiedEditor = editor.getModifiedEditor()

        addSelectListener(originalEditor, gs, monaco)
        addSelectListener(modifiedEditor, gs, monaco)

        console.log(originalEditor)
    }

    const updateToGlobal = (dir: string) => {
        if (diffEditorRef.current) {
            const editor = diffEditorRef.current as any
            const originalEditor =
                dir === "left" ? editor.getOriginalEditor() : editor.getModifiedEditor()
            gs.setDataSource(originalEditor.getModel().getValue())
            message.success(`已经${dir === 'left' ? '左侧' : '右侧'}内容同步至Code`)
        }
    }

    const getReplaceWarning = (result: ReplaceSelectionResult) => {
        const warningMap: Record<string, string> = {
            "text-control-empty-selection": "当前焦点在输入框里，但没有选中文本",
            "selection-unavailable": "当前页面不支持读取选区",
            "no-selection-range": "当前页面没有可替换的选区",
            "collapsed-selection": "当前页面选区为空，请先选中文本",
            "editable-without-insert-text": "当前可编辑区域不支持直接写入选中文本",
            "invalid-range": "当前选区无效，建议重新选择一次",
        }

        return warningMap[result.reason || ""] || "当前页面没有可替换的选区"
    }

    const handleReadSelection = async () => {
        try {
            gs.setDataSource(await readPageSelection())
            message.success("已读取页面选中文本")
        } catch (error: any) {
            message.error(error.message || "读取页面选中文本失败")
        }
    }

    const handleReadVisibleText = async () => {
        try {
            gs.setDataSource(await readPageVisibleText())
            message.success("已读取页面可见文本")
        } catch (error: any) {
            message.error(error.message || "读取页面可见文本失败")
        }
    }

    const handleReadPageHtml = async () => {
        try {
            gs.setDataSource(await readPageHtml())
            message.success("已读取页面 HTML")
        } catch (error: any) {
            message.error(error.message || "读取页面 HTML 失败")
        }
    }

    const handleReplaceSelection = async () => {
        try {
            const result = await replacePageSelection(gs.dataSource)
            if (!result.ok) {
                message.warning(getReplaceWarning(result))
                return
            }

            message.success("已将面板内容写回页面选区")
        } catch (error: any) {
            message.error(error.message || "写回页面选区失败")
        }
    }

    const setterProps = { wordWrap, setWordWrap, language, setLanguage, diffSync, setDiffSync }
    const pageActionButtons = (
        <Space size={6} wrap className="editor-page-actions">
            <Button size="small" onClick={handleReadSelection}>读取选中</Button>
            <Button size="small" onClick={handleReadVisibleText}>页面文本</Button>
            <Button size="small" onClick={handleReadPageHtml}>页面HTML</Button>
            <Button size="small" type="primary" onClick={handleReplaceSelection}>替换选中</Button>
        </Space>
    )
    return (
        <div className="diff-page">
            <EditorSetter {...setterProps} onSync={updateToGlobal} extraActions={pageActionButtons} />
            <DiffEditor
                height="84vh"
                theme={gs.isDarkMode ? "vs-dark" : "vs"}
                language={language}
                original={gs.dataSource}
                modified={gs.dataSource}
                options={{
                    wordWrap: wordWrap ? "on" : "off", // 设置自动换行
                    wrappingIndent: "indent", // 设置缩进方式
                    originalEditable: true,
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    )
}

export default observer(App)
