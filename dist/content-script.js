const sakState = {
  lastEditable: null,
  lastRange: null,
};

const isTextInput = (element) => {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    return false;
  }

  if (element instanceof HTMLTextAreaElement) {
    return true;
  }

  return /^(text|search|url|tel|password|email|number)$/i.test(element.type || "text");
};

const getEditableSelection = (element) => {
  if (!isTextInput(element)) {
    return null;
  }

  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;

  return {
    element,
    start,
    end,
    text: end > start ? element.value.slice(start, end) : "",
  };
};

const getSelectedText = () => {
  const editable = getEditableSelection(document.activeElement) || getEditableSelection(sakState.lastEditable);
  if (editable?.text) {
    return editable.text;
  }

  return window.getSelection?.()?.toString() || "";
};

const getPageText = () => document.body?.innerText || "";

const getPageHtml = () => document.documentElement?.outerHTML || "";

const replaceEditableSelection = (replacement) => {
  const editable =
    getEditableSelection(document.activeElement) || getEditableSelection(sakState.lastEditable);

  if (!editable || editable.end <= editable.start) {
    return false;
  }

  const { element, start, end } = editable;
  element.value = element.value.slice(0, start) + replacement + element.value.slice(end);
  element.selectionStart = start;
  element.selectionEnd = start + replacement.length;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
};

const replaceContentEditableSelection = (replacement) => {
  const selection = window.getSelection?.();
  const range =
    selection && selection.rangeCount > 0 && !selection.isCollapsed
      ? selection.getRangeAt(0).cloneRange()
      : sakState.lastRange?.cloneRange?.();

  if (!range) {
    return false;
  }

  const container =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;

  const element = container instanceof Element ? container.closest("[contenteditable='true']") : null;
  if (!(element instanceof HTMLElement) || !element.isContentEditable) {
    return false;
  }

  range.deleteContents();
  const textNode = document.createTextNode(replacement);
  range.insertNode(textNode);

  const nextRange = document.createRange();
  nextRange.setStart(textNode, 0);
  nextRange.setEnd(textNode, replacement.length);

  selection?.removeAllRanges();
  selection?.addRange(nextRange);
  sakState.lastRange = nextRange.cloneRange();

  element.dispatchEvent(new InputEvent("input", { bubbles: true, data: replacement, inputType: "insertText" }));
  return true;
};

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (isTextInput(target)) {
    sakState.lastEditable = target;
  }
});

document.addEventListener("selectionchange", () => {
  const active = document.activeElement;
  if (isTextInput(active)) {
    sakState.lastEditable = active;
  }

  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return;
  }

  sakState.lastRange = selection.getRangeAt(0).cloneRange();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  try {
    switch (message?.type) {
      case "SAK_GET_SELECTED_TEXT":
        sendResponse({ ok: true, data: getSelectedText() });
        break;
      case "SAK_GET_PAGE_TEXT":
        sendResponse({ ok: true, data: getPageText() });
        break;
      case "SAK_GET_PAGE_HTML":
        sendResponse({ ok: true, data: getPageHtml() });
        break;
      case "SAK_REPLACE_SELECTED_TEXT": {
        const replacement = `${message?.payload ?? ""}`;
        const ok = replaceEditableSelection(replacement) || replaceContentEditableSelection(replacement);
        sendResponse({
          ok,
          data: ok
            ? "replaced"
            : "Only editable inputs, textareas, and contenteditable selections are supported.",
        });
        break;
      }
      default:
        sendResponse({ ok: false, data: "Unknown message type." });
    }
  } catch (error) {
    sendResponse({ ok: false, data: error instanceof Error ? error.message : String(error) });
  }

  return true;
});
