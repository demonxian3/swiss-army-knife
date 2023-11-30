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

const ThemeContent = observer(() => {
    const { globalStore } = useStore()

    useEffect(() => {
        globalStore.loadTheme()
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
