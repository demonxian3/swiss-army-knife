import { useState, useRef } from "react"
import { observer } from "mobx-react-lite"
import { DiffEditor, Monaco } from "@monaco-editor/react"
import { useStore } from "@/stores"
import { useLocalStorage } from "react-use"
import EditorSetter from "@/components/EditorSetter"
import { addSelectListener } from "@/misc/common"
import "./index.less"
import { debounce } from "lodash"
import { message } from "antd"

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

    const setterProps = { wordWrap, setWordWrap, language, setLanguage, diffSync, setDiffSync }
    return (
        <>
            <EditorSetter {...setterProps} onSync={updateToGlobal} />
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
        </>
    )
}

export default observer(App)
