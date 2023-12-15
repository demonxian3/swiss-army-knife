import { useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { DiffEditor } from "@monaco-editor/react"
import { Select, Form, Switch } from "antd"
import { useStore } from "@/stores"
import "./index.less"
import { useLocalStorage } from "react-use"

function App() {
    const diffEditorRef = useRef(null)
    const { globalStore: gs } = useStore()
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")

    function handleEditorDidMount(editor, monaco) {
        diffEditorRef.current = editor
    }

    function showOriginalValue() {
        // alert(diffEditorRef.current.getOriginalEditor().getValue())
    }

    function showModifiedValue() {
        // alert(diffEditorRef.current.getModifiedEditor().getValue())
    }

    const handleChangeLanguage = (lang: string) => {
        setLanguage(lang)
    }

    return (
        <>
            <Form layout="inline" size="small" className="my-2">
                <Form.Item label="语言">
                    <Select
                        value={language}
                        style={{ width: "120px" }}
                        size="small"
                        onChange={handleChangeLanguage}
                        options={[
                            "javascript",
                            "json",
                            "xml",
                            "java",
                            "go",
                            "python",
                            "bash",
                            "typescript",
                            "typescriptreact",
                            "javascriptreact",
                        ].map((i) => ({
                            label: i,
                            value: i,
                        }))}
                    ></Select>
                </Form.Item>
                <Form.Item label="自动换行">
                    <Switch checked={wordWrap} onChange={setWordWrap} size="small" />
                </Form.Item>
            </Form>
            <DiffEditor
                height="90vh"
                theme={gs.isDarkMode ? "vs-dark" : "vs"}
                language={language}
                original="// the original code"
                modified="// the modified code"
                options={{
                    wordWrap: wordWrap ? "on" : "off", // 设置自动换行
                    wrappingIndent: "indent", // 设置缩进方式
                    originalEditable: true,
                }}
                onMount={handleEditorDidMount}
            />
        </>
    )
}

export default observer(App)
