import ReactDOM from "react-dom/client"
import { Layout, ConfigProvider, theme } from "antd"
import stores, { StoreContext } from "./stores/index"
import "virtual:windi.css"
import "./index.less"
import router from "@/router/routes"
import { RouterProvider } from "react-router-dom"
import themeConf from "@/layouts/theme"
import darkThemeConf from "@/layouts/darkTheme"
import { useStore } from "@/stores/index"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { loader } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

// 引入 worker 文件

const ThemeContent = observer(() => {
    const { globalStore } = useStore()

    useEffect(() => {
        globalStore.loadTheme()
        loader.config({ monaco })
        self.MonacoEnvironment = {
            getWorker(_, label) {
                if (label === "json") {
                    return new jsonWorker()
                }
                if (label === "css" || label === "scss" || label === "less") {
                    return new cssWorker()
                }
                if (label === "html" || label === "handlebars" || label === "razor") {
                    return new htmlWorker()
                }
                if (label === "typescript" || label === "javascript") {
                    return new tsWorker()
                }
                return new editorWorker()
            },
        }
        loader.config({ monaco })
        loader.init()
    }, [])

    return (
        <ConfigProvider
            theme={globalStore.themeTag === "light" ? themeConf : darkThemeConf}
            locale={globalStore.localeLang}
        >
            <RouterProvider router={router} />
        </ConfigProvider>
    )
})

const App = () => {
    return (
        <StoreContext.Provider value={{ ...stores }}>
            <ThemeContent />
        </StoreContext.Provider>
    )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
