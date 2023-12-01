import { makeAutoObservable } from "mobx"
import enUS from "antd/locale/en_US"
import zhCN from "antd/locale/zh_CN"

class GlobalStore {
    localeKey = "cn"
    localeLang = zhCN
    themeTag = "light"
    themeKey = "rds_theme"
    toolBoxExpand = false

    constructor() {
        makeAutoObservable(this)
    }

    toggleExpand() {
        this.toolBoxExpand = !this.toolBoxExpand
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
}

export default GlobalStore
