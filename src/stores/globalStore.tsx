import { makeAutoObservable } from "mobx"
import enUS from "antd/locale/en_US"
import zhCN from "antd/locale/zh_CN"
import { SELECTOR_DATAAREA, defaultDataSource } from "@/configs/constant"
import { getLocaleStorageKey, getStoredLocale, LocaleKey, t } from "@/i18n"

class GlobalStore {
    localeKey: LocaleKey = "cn"
    localeLang = zhCN
    themeTag = "light"
    themeKey = "rds_theme"
    localeStorageKey = getLocaleStorageKey()
    toolBoxExpand = false
    historyExpand = false
    historyActiveKey = -1
    jsonSelection: { type: string; path: string[] } | null = null
    editorRef: any = null
    monacoRef: any = null
    editorSelection: any = null
    dataSourceUpdater: Function = (fn: Function) => (text: string) => this.setDataSource(fn(text))
    dataSource = JSON.stringify(defaultDataSource)
    leftDataSource = ""
    rightDataSource = ""
    historyStack: { time: number; text: string; label: string }[] = []
    treeSettings: Record<string, any> = {
        showAnt: localStorage.getItem("tree-show-ant") === "true" || false,
        showReact: localStorage.getItem("tree-show-react") === "true" || false,
        antFilter: ["antd", "refe"],
    }

    constructor() {
        makeAutoObservable(this)
    }

    setTreeSettings = (key: string, value: any) => {
        this.treeSettings[key] = value
    }

    setDataSourceUpdater = (updater: any) => {
        this.dataSourceUpdater = updater
    }

    setJsonSelection(selection: { type: string; path: string[] } | null) {
        this.jsonSelection = selection
    }

    addHistoryItem(text: string, label: string) {
        // 如果选中非最后一条历史记录，新增记录要覆盖和清除后面的记录
        let stack = this.historyStack
        if (this.historyActiveKey < this.historyStack.length - 1) {
            stack = this.historyStack.slice(0, this.historyActiveKey + 1)
        }

        // 通过返回新数组触发引用类型地址变动，使得观察者组件能够重新渲染
        this.historyStack = [...stack, { time: new Date().getTime(), text, label }]
        this.setHistoryActiveKey(this.historyStack.length - 1)

        // 每次更新时，另滚动条始终保持底部
        setTimeout(() => {
            const elem = document.querySelector(".history-scroll") as HTMLDivElement
            elem.scrollTop = elem.scrollHeight
        }, 1)
    }

    delHistoryItem(idx: number) {
        const stack = this.historyStack.slice()
        stack.splice(idx, 1)
        this.historyStack = stack
        if (this.historyActiveKey >= this.historyStack.length) {
            this.historyActiveKey = this.historyStack.length - 1
        }
    }

    setHistoryActiveKey(idx: number) {
        this.historyActiveKey = idx
    }

    setDataSource(text: string) {
        this.dataSource = text
    }

    setLeftDataSource(text: string) {
        this.leftDataSource = text
    }

    setRightDataSource(text: string) {
        this.rightDataSource = text
    }

    getSelectionInfo(selector: string = "") {
        const elem = selector
            ? (document.querySelector(selector) as HTMLTextAreaElement)
            : (document.activeElement as HTMLTextAreaElement)

        if (!elem || !(elem instanceof HTMLTextAreaElement)) {
            return { elem: null, start: 0, end: 0, selectText: "", hasSelection: false }
        }

        const { selectionStart: start, selectionEnd: end } = elem
        const selectText = elem.value.slice(start, end)

        return { elem, start, end, selectText, hasSelection: selectText.length && end > start }
    }

    setData(replaceText: string): string {
        const { elem, start, end, hasSelection } = this.getSelectionInfo(SELECTOR_DATAAREA)

        if (hasSelection) {
            const newText = elem!.value.slice(0, start) + replaceText + elem!.value.slice(end)
            this.setDataSource(newText)

            setTimeout(() => {
                elem!.focus()
                elem!.setSelectionRange(start, start + replaceText.length)
            }, 1)

            return newText
        }

        this.setDataSource(replaceText)
        return replaceText
    }

    setDomData(selector: string, replaceText: string, label: string) {
        const { elem, start, end, hasSelection } = this.getSelectionInfo(selector)

        if (!(elem instanceof HTMLTextAreaElement)) {
            throw new Error(t(this.localeKey, "dataArea.noSelectedTextarea"))
        }

        if (!this.historyStack.length) {
            this.addHistoryItem(this.getDomData(selector), t(this.localeKey, "common.initialData"))
        }

        if (hasSelection) {
            const newText = elem.value.slice(0, start) + replaceText + elem!.value.slice(end)
            elem.value = newText
            this.addHistoryItem(newText, label)

            setTimeout(() => {
                elem!.focus()
                elem!.setSelectionRange(start, start + replaceText.length)
            }, 1)
        } else {
            elem.value = replaceText
            this.addHistoryItem(replaceText, label)
        }
    }

    getDomData(selector: string) {
        const elements = Array.from(document.querySelectorAll(selector)) as HTMLTextAreaElement[]

        if (elements.length !== 1) {
            throw new Error(t(this.localeKey, "dataArea.textareaNotUnique"))
            return ""
        }

        return elements[0].value
    }

    getToolboxWidth(isLaptop = false) {
        if (isLaptop) {
            return this.toolBoxExpand ? "expanded w-250px" : "collapsed w-26px"
        }

        return this.toolBoxExpand ? "expanded w-280px" : "collapsed w-26px"
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
        this.localeKey = (key === "en" ? "en" : "cn") as LocaleKey

        if (this.localeKey === "cn") {
            this.localeLang = zhCN
        } else {
            this.localeLang = enUS
        }

        localStorage.setItem(this.localeStorageKey, this.localeKey)
    }

    loadLocale() {
        this.changeLocale(getStoredLocale())
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
        const { selectText, hasSelection } = this.getSelectionInfo(SELECTOR_DATAAREA)
        return hasSelection ? selectText : this.dataSource
    }
}

export default GlobalStore
