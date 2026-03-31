import { getStoredLocale, t } from "@/i18n"

const evalInInspectedWindow = <T>(expression: string): Promise<T> =>
    new Promise((resolve, reject) => {
        chrome.devtools.inspectedWindow.eval(
            expression,
            (result: T, exceptionInfo: { isException?: boolean; value?: string }) => {
                if (exceptionInfo?.isException) {
                    reject(new Error(exceptionInfo.value || t(getStoredLocale(), "devtools.evalFailed")))
                    return
                }

                resolve(result)
            }
        )
    })

export interface ReplaceSelectionResult {
    ok: boolean
    reason?: string
}

const pageSelectionScript = `(() => {
    const active = document.activeElement
    if (
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLInputElement && /^(text|search|url|tel|password)$/i.test(active.type))
    ) {
        const start = active.selectionStart ?? 0
        const end = active.selectionEnd ?? 0
        return active.value.slice(start, end)
    }

    return window.getSelection?.()?.toString?.() || ""
})()`

const pageVisibleTextScript = `(() => document.body?.innerText || "")()`

const pageHtmlScript = `(() => document.documentElement?.outerHTML || "")()`

const buildReplaceSelectionScript = (content: string) => `(() => {
    const nextText = ${JSON.stringify(content)}
    const active = document.activeElement
    const hasTextControlFocus =
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLInputElement && /^(text|search|url|tel|password)$/i.test(active.type))

    if (hasTextControlFocus) {
        const start = active.selectionStart ?? 0
        const end = active.selectionEnd ?? 0
        if (start === end) {
            return { ok: false, reason: "text-control-empty-selection" }
        }

        active.focus()
        active.setRangeText(nextText, start, end, "end")
        active.dispatchEvent(new Event("input", { bubbles: true }))
        active.dispatchEvent(new Event("change", { bubbles: true }))
        return { ok: true }
    }

    const selection = window.getSelection?.()
    if (!selection) {
        return { ok: false, reason: "selection-unavailable" }
    }

    if (selection.rangeCount === 0) {
        return { ok: false, reason: "no-selection-range" }
    }

    const range = selection.getRangeAt(0)
    if (!range) {
        return { ok: false, reason: "no-selection-range" }
    }

    if (selection.isCollapsed) {
        return { ok: false, reason: "collapsed-selection" }
    }

    const anchor = selection.anchorNode
    const editable = anchor instanceof Element
        ? anchor.closest?.("[contenteditable='true']")
        : anchor?.parentElement?.closest?.("[contenteditable='true']")

    if (editable && document.queryCommandSupported?.("insertText")) {
        editable.focus()
        document.execCommand("insertText", false, nextText)
        return { ok: true }
    }

    if (editable) {
        return { ok: false, reason: "editable-without-insert-text" }
    }

    if (!range.commonAncestorContainer) {
        return { ok: false, reason: "invalid-range" }
    }

    range.deleteContents()
    const textNode = document.createTextNode(nextText)
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    return { ok: true }
})()`

export const readPageSelection = () => evalInInspectedWindow<string>(pageSelectionScript)

export const readPageVisibleText = () => evalInInspectedWindow<string>(pageVisibleTextScript)

export const readPageHtml = () => evalInInspectedWindow<string>(pageHtmlScript)

export const replacePageSelection = (content: string) =>
    evalInInspectedWindow<ReplaceSelectionResult>(buildReplaceSelectionScript(content))
