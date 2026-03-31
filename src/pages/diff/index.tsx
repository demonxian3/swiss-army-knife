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
import { useI18n } from "@/i18n"
import "./index.less"

function App() {
    const diffEditorRef = useRef<typeof DiffEditor | null>(null)
    const { globalStore: gs } = useStore()
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")
    const [diffSync, setDiffSync] = useLocalStorage<number>("editor-sync", 0) // noSync:0 syncLeft:1 syncRight:2
    const { t } = useI18n()

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
            message.success(
                dir === "left" ? t("editor.syncToCodeSuccessLeft") : t("editor.syncToCodeSuccessRight"),
            )
        }
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

    const setterProps = { wordWrap, setWordWrap, language, setLanguage, diffSync, setDiffSync }
    const pageActionButtons = (
        <Space size={6} wrap className="editor-page-actions">
            <Button size="small" onClick={handleReadSelection}>{t("editor.readSelection")}</Button>
            <Button size="small" onClick={handleReadVisibleText}>{t("editor.pageText")}</Button>
            <Button size="small" onClick={handleReadPageHtml}>{t("editor.pageHtml")}</Button>
            <Button size="small" type="primary" onClick={handleReplaceSelection}>{t("editor.replaceSelection")}</Button>
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
