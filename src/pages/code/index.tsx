import { useRef } from "react"
import { observer } from "mobx-react-lite"
import Editor from "@monaco-editor/react"
import { useStore } from "@/stores"
import { useLocalStorage } from "react-use"
import EditorSetter from "@/components/EditorSetter"
import { addSelectListener } from "@/misc/common"
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

    // function handleEditorWillMount(monaco) {
    //     console.log("beforeMount: the monaco instance:", monaco)
    // }

    // function handleEditorValidation(markers) {
    //     // model markers
    //     // markers.forEach(marker => console.log('onValidate:', marker.message));
    // }

    return (
        <>
            <EditorSetter
                wordWrap={wordWrap}
                setWordWrap={setWordWrap}
                language={language}
                setLanguage={setLanguage}
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
        </>
    )
}

export default observer(App)
