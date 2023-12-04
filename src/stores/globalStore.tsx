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
    historyActiveKey = -1
    dataSource = `{
        "url": "https://www.example.com:8080/path/to/page?name=John&age=25#section1",
        "stringVar": "Hello, World!",
        "numberVar": 42,
        "booleanVar": true,
        "nullVar": null,
        "undefinedVar": undefined,
        "arrayVar": [1, "two", false, null],
        "objectVar": {
          "key1": "value1",
          "key2": 123,
          "key3": true,
          "key4": null
        }
      }，1701659378018，Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools。`
    historyStack: { time: number; text: string; label: string }[] = []

    constructor() {
        makeAutoObservable(this)
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

    getSelectionInfo() {
        const elem = document.querySelector("textarea")

        if (!elem) {
            return { elem: null, start: 0, end: 0, selectText: "", hasSelection: false }
        }

        const { selectionStart: start, selectionEnd: end } = elem
        const selectText = elem.value.slice(start, end)

        return { elem, start, end, selectText, hasSelection: selectText.length && end > start }
    }

    setData(replaceText: string, label: string) {
        const { elem, start, end, hasSelection } = this.getSelectionInfo()

        // 当历史为空，将初始数据作为历史记录首条
        if (!this.historyStack.length) {
            this.addHistoryItem(this.dataSource, "初始数据")
        }

        if (hasSelection) {
            const newText = elem!.value.slice(0, start) + replaceText + elem!.value.slice(end)
            this.setDataSource(newText)
            this.addHistoryItem(newText, label)

            setTimeout(() => {
                elem!.focus()
                elem!.setSelectionRange(start, start + replaceText.length)
            }, 1)
        } else {
            this.setDataSource(replaceText)
            this.addHistoryItem(replaceText, label)
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
