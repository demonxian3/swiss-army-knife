import { useRef } from "react"
import { observer } from "mobx-react-lite"
import Editor from "@monaco-editor/react"
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
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")

    const { globalStore: gs } = useStore()
    function handleEditorChange(value: string, event: any) {
        // here is the current value
        // console.log("here is the current model value:", value, event)
        gs.setDataSource(value)
    }

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor
        monacoRef.current = monaco

        // 添加事件监听器
        addSelectListener(editor, gs, monaco)
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

    const pageActionButtons = (
        <Space size={6} wrap className="editor-page-actions">
            <Button size="small" onClick={handleReadSelection}>读取选中</Button>
            <Button size="small" onClick={handleReadVisibleText}>页面文本</Button>
            <Button size="small" onClick={handleReadPageHtml}>页面HTML</Button>
            <Button size="small" type="primary" onClick={handleReplaceSelection}>替换选中</Button>
        </Space>
    )

    // function handleEditorWillMount(monaco) {
    //     console.log("beforeMount: the monaco instance:", monaco)
    // }

    // function handleEditorValidation(markers) {
    //     // model markers
    //     // markers.forEach(marker => console.log('onValidate:', marker.message));
    // }

    return (
        <div className="editor-page">
            <EditorSetter
                wordWrap={wordWrap}
                setWordWrap={setWordWrap}
                language={language}
                setLanguage={setLanguage}
                extraActions={pageActionButtons}
            />

            <Editor
                value={gs.dataSource}
                height="84vh"
                options={{
                    wordWrap: wordWrap ? "on" : "off", // 设置自动换行
                    wrappingIndent: "indent", // 设置缩进方式
                }}
                language={language}
                theme={gs.isDarkMode ? "vs-dark" : "vs"}
                onChange={handleEditorChange as any}
                onMount={handleEditorDidMount}
                // beforeMount={handleEditorWillMount}
                // onValidate={handleEditorValidation}
            />
        </div>
    )
}

export default observer(App)
