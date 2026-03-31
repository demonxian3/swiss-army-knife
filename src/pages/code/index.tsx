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
import { useI18n } from "@/i18n"
import "./index.less"

function App() {
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")

    const { globalStore: gs } = useStore()
    const { t } = useI18n()
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
            "text-control-empty-selection": t("editor.replaceWarnings.textControlEmptySelection"),
            "selection-unavailable": t("editor.replaceWarnings.selectionUnavailable"),
            "no-selection-range": t("editor.replaceWarnings.noSelectionRange"),
            "collapsed-selection": t("editor.replaceWarnings.collapsedSelection"),
            "editable-without-insert-text": t("editor.replaceWarnings.editableWithoutInsertText"),
            "invalid-range": t("editor.replaceWarnings.invalidRange"),
        }

        return warningMap[result.reason || ""] || t("editor.replaceWarnings.fallback")
    }

    const handleReadSelection = async () => {
        try {
            gs.setDataSource(await readPageSelection())
            message.success(t("editor.readSelectionSuccess"))
        } catch (error: any) {
            message.error(error.message || t("editor.readSelectionFailed"))
        }
    }

    const handleReadVisibleText = async () => {
        try {
            gs.setDataSource(await readPageVisibleText())
            message.success(t("editor.readVisibleTextSuccess"))
        } catch (error: any) {
            message.error(error.message || t("editor.readVisibleTextFailed"))
        }
    }

    const handleReadPageHtml = async () => {
        try {
            gs.setDataSource(await readPageHtml())
            message.success(t("editor.readPageHtmlSuccess"))
        } catch (error: any) {
            message.error(error.message || t("editor.readPageHtmlFailed"))
        }
    }

    const handleReplaceSelection = async () => {
        try {
            const result = await replacePageSelection(gs.dataSource)
            if (!result.ok) {
                message.warning(getReplaceWarning(result))
                return
            }

            message.success(t("common.saveToPageSelectionSuccess"))
        } catch (error: any) {
            message.error(error.message || t("editor.replaceSelectionFailed"))
        }
    }

    const pageActionButtons = (
        <Space size={6} wrap className="editor-page-actions">
            <Button size="small" onClick={handleReadSelection}>{t("editor.readSelection")}</Button>
            <Button size="small" onClick={handleReadVisibleText}>{t("editor.pageText")}</Button>
            <Button size="small" onClick={handleReadPageHtml}>{t("editor.pageHtml")}</Button>
            <Button size="small" type="primary" onClick={handleReplaceSelection}>{t("editor.replaceSelection")}</Button>
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
