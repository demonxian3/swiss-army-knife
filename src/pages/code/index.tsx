import { useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import Editor, { Monaco } from "@monaco-editor/react"
import { Select, Form, Switch } from "antd"
import { useStore } from "@/stores"
import "./index.less"
import { useLocalStorage } from "react-use"

function App() {
    const editorRef = useRef<any>(null)
    const monacoRef = useRef<any>(null)
    const [wordWrap, setWordWrap] = useLocalStorage<boolean>("editor-autoWrap", false)
    const [language, setLanguage] = useLocalStorage<string>("editor-language", "json")

    const { globalStore: gs } = useStore()
    function handleEditorChange(value: string, event) {
        // here is the current value
        console.log("here is the current model value:", value, event)
        gs.setDataSource(value)
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
        monacoRef.current = monaco

        // 添加事件监听器
        editor.onDidChangeCursorSelection(() => {
            // 获取所有选中的文本范围

            // 记录选中信息
            const edits: { range: any; text: string }[] = []
            editor.getSelections().forEach((selection: any) => {
                const { startLineNumber, endLineNumber, startColumn, endColumn } = selection

                if (startColumn !== endColumn || startLineNumber !== endLineNumber) {
                    edits.push({
                        range: new monaco.Range(
                            startLineNumber,
                            startColumn,
                            endLineNumber,
                            endColumn,
                        ),
                        text: editor.getModel().getValueInRange(selection),
                    })
                }
            })

            if (edits.length) {
                gs.setDataSourceUpdater((fn: Function) => {
                    const multiUpdateEdits = edits.map(({ range, text }) => ({
                        range,
                        text: fn(text),
                    }))
                    editor.getModel().applyEdits(multiUpdateEdits)
                    // editor.setSelection(null)
                })
            } else {
                gs.setDataSourceUpdater((fn: Function) => gs.setDataSource(fn(gs.dataSource)))
            }

            // const edits: { range: any; text: string }[] = []
            // // 遍历选中范围，获取选中的文本
            // const selectedTexts = selections.forEach((selection: any) => {
            //     const startLineNumber = selection.startLineNumber
            //     const startColumn = selection.startColumn
            //     const endLineNumber = selection.endLineNumber
            //     const endColumn = selection.endColumn

            //     edits.push({
            //         range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
            //         text: "LKKKKKKK",
            //     })
            //     // console.log(selection)
            //     // return editor.getModel().getValueInRange(selection)
            // })

            // editor.getModel().applyEdits(edits)
            // editor.setSelection(null)
            // console.log("Selected texts:", selectedTexts)
        })
    }

    function handleEditorWillMount(monaco) {
        console.log("beforeMount: the monaco instance:", monaco)
    }

    function handleEditorValidation(markers) {
        // model markers
        // markers.forEach(marker => console.log('onValidate:', marker.message));
    }

    const handleChangeLanguage = (lang: string) => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel()
            if (model) {
                monacoRef.current.editor.setModelLanguage(model, lang)
                setLanguage(lang)
            }
        }
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

            <Editor
                value={gs.dataSource}
                height="84vh"
                options={{
                    wordWrap: wordWrap ? "on" : "off", // 设置自动换行
                    wrappingIndent: "indent", // 设置缩进方式
                }}
                defaultLanguage={language}
                theme={gs.isDarkMode ? "vs-dark" : "vs"}
                onChange={handleEditorChange as any}
                onMount={handleEditorDidMount}
                beforeMount={handleEditorWillMount}
                onValidate={handleEditorValidation}
            />
        </>
    )
}

export default observer(App)
