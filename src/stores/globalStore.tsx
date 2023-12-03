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
        "Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools"
    historyStack: any[] = []
    selection = {
        selectionStart: 0,
        selectionEnd: 0,
        elem: null as any as HTMLTextAreaElement,
        content: "",
    }

    constructor() {
        makeAutoObservable(this)
    }

    setSelection(selectionStart: number, selectionEnd: number, elem: any, content: string) {
        this.selection.content = content
        this.selection.elem = elem
        this.selection.selectionStart = selectionStart
        this.selection.selectionEnd = selectionEnd

        console.log(selectionStart, selectionEnd, elem, content)
    }

    addHistoryItem(stack: any) {
        this.historyStack.push(stack)
    }

    setDataSource(text: string) {
        this.dataSource = text
    }

    setData(replaceText: string) {
        if (this.selection.content) {
            const { selectionStart: start, selectionEnd: end, elem } = this.selection
            const newText =
                this.dataSource.slice(0, start) + replaceText + this.dataSource.slice(end)

            console.log(start, end, newText)
            this.setDataSource(newText)
            this.selection.selectionEnd = start + replaceText.length
            this.selection.content = replaceText

            setTimeout(() => {
                elem.focus()
                elem.setSelectionRange(start, start + replaceText.length)
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
        return this.selection.content || this.dataSource
    }
}

export default GlobalStore
