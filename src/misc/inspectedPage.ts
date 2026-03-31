type InspectedPageAction =
    | "SAK_GET_SELECTED_TEXT"
    | "SAK_GET_PAGE_TEXT"
    | "SAK_GET_PAGE_HTML"
    | "SAK_REPLACE_SELECTED_TEXT"

const getInspectedTabId = () => chrome?.devtools?.inspectedWindow?.tabId

const sendInspectedPageMessage = <T>(type: InspectedPageAction, payload?: string) =>
    new Promise<T>((resolve, reject) => {
        const tabId = getInspectedTabId()

        if (typeof tabId !== "number") {
            reject(new Error("当前环境不是 DevTools 面板，无法访问页面内容"))
            return
        }

        chrome.tabs.sendMessage(tabId, { type, payload }, (response: { ok: boolean; data: T }) => {
            const runtimeError = chrome.runtime?.lastError
            if (runtimeError) {
                reject(new Error(runtimeError.message))
                return
            }

            if (!response?.ok) {
                reject(new Error((response?.data as string) || "页面通信失败"))
                return
            }

            resolve(response.data)
        })
    })

export const getInspectedSelection = () =>
    sendInspectedPageMessage<string>("SAK_GET_SELECTED_TEXT")

export const getInspectedPageText = () =>
    sendInspectedPageMessage<string>("SAK_GET_PAGE_TEXT")

export const getInspectedPageHtml = () =>
    sendInspectedPageMessage<string>("SAK_GET_PAGE_HTML")

export const replaceInspectedSelection = (text: string) =>
    sendInspectedPageMessage<string>("SAK_REPLACE_SELECTED_TEXT", text)
