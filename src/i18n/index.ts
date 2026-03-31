import { useStore } from "@/stores"
import enUS from "./locales/enUS"
import zhCN from "./locales/zhCN"

export type LocaleKey = "cn" | "en"

const messages = {
    cn: zhCN,
    en: enUS,
}

const localeStorageKey = "sak_locale"

const getByPath = (target: Record<string, any>, path: string) =>
    path.split(".").reduce((ret, key) => ret?.[key], target)

export const getStoredLocale = (): LocaleKey => {
    const locale = localStorage.getItem(localeStorageKey)
    return locale === "en" ? "en" : "cn"
}

export const getLocaleStorageKey = () => localeStorageKey

export const t = (locale: LocaleKey, key: string) => {
    const value = getByPath(messages[locale], key) ?? getByPath(messages.cn, key) ?? key
    return typeof value === "string" ? value : key
}

export const translateToolLabel = (locale: LocaleKey, label: string) =>
    t(locale, `coder.labels.${label}`)

export const useI18n = () => {
    const { globalStore } = useStore()

    return {
        localeKey: globalStore.localeKey,
        t: (key: string) => t(globalStore.localeKey, key),
        translateToolLabel: (label: string) => translateToolLabel(globalStore.localeKey, label),
    }
}
