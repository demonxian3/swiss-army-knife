import { makeAutoObservable } from "mobx"
import enUS from "antd/locale/en_US"
import zhCN from "antd/locale/zh_CN"

class GlobalStore {
    localeKey = "cn"
    localeLang = zhCN
    themeTag = "light"
    themeKey = "rds_theme"
    toolBoxExpand = true
    historyExpand = true
    dataSource =
        "Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools"
    historyStack: any[] = []
 

    constructor() {
        makeAutoObservable(this)
    }

    addHistoryItem(stack: any) {
        this.historyStack.push(stack)
    }

    setDataSource(text: string) {
        this.dataSource = text
    }

    getSelectionInfo() {
        const elem = document.querySelector("textarea")

        if (!elem) {
            return { elem: null, start: 0, end: 0, selectText: "", hasSelection: false }
        }

        const { selectionStart: start, selectionEnd: end } = elem
        const selectText = elem.value.slice(start, end)

        return { elem, start, end, selectText, hasSelection: selectText.length && end > start }
    }

    setData(replaceText: string) {
        const { elem, start, end, hasSelection } = this.getSelectionInfo()

        if (hasSelection) {
            const newText = elem!.value.slice(0, start) + replaceText + elem!.value.slice(end)
            this.setDataSource(newText)

            setTimeout(() => {
                elem!.focus()
                elem!.setSelectionRange(start, start + replaceText.length)
            }, 1)
        } else {
            this.setDataSource(replaceText)
        }
    }

    getToolboxWidth(isLaptop = false) {
        if (isLaptop) {
            return this.toolBoxExpand ? "expanded w-220px" : "collapsed w-26px"
        }

        return this.toolBoxExpand ? "expanded w-240px" : "collapsed w-26px"
    }

    getHistoryWidth(isLaptop = false) {
        if (isLaptop) {
            return this.historyExpand ? "expanded w-280px" : "collapsed w-26px"
        }

        return this.historyExpand ? "expanded w-320px" : "collapsed w-26px"
    }

    toggleToolExpand() {
        this.toolBoxExpand = !this.toolBoxExpand
    }

    toggleHistoryExpand() {
        this.historyExpand = !this.historyExpand
    }

    changeLocale(key: string) {
        this.localeKey = key

        if (this.localeKey === "cn") {
            this.localeLang = zhCN
        } else {
            this.localeLang = enUS
        }
    }

    loadTheme() {
        try {
            const themeStr = localStorage.getItem(this.themeKey) ?? ""

            if (themeStr.length === 0) {
                localStorage.setItem(this.themeKey, this.themeTag)
            } else {
                this.themeTag = themeStr
            }

            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    changeTheme(tag: string) {
        this.themeTag = tag
        localStorage.setItem(this.themeKey, this.themeTag)
    }

    get isDarkMode() {
        return this.themeTag !== "light"
    }

    get data() {
        const { selectText, hasSelection } = this.getSelectionInfo()
        return hasSelection ? selectText : this.dataSource
    }
}

export default GlobalStore
