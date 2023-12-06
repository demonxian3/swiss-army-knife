export const getElementByXPath = (xpath: string): HTMLFormElement =>
    document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue as HTMLFormElement

export const getSegmentedValue = (field: string): string =>
    getElementByXPath(
        `//div[@id='${field}']//label[contains(@class, "ant-segmented-item-selected")]/div[@title]`,
    )?.title || ""

export const getSelectedValue = (field: string): string =>
    getElementByXPath(`//span[input[@id="${field}"]]//following-sibling::span[@title]`)?.title || ""

export const getInputValue = (field: string): string =>
    getElementByXPath(`//input[@id="${field}"]`)?.value || ""

const typeGetterMap = {
    segmented: getSegmentedValue,
    select: getSelectedValue,
    input: getInputValue,
    // 添加其他可能的键值对
} as Record<string, (field: string) => string>

export const getFieldsValue = (
    fields: { type: string; name: string }[],
): Record<string, string> => {
    return fields.reduce<Record<string, string>>(
        (ret, i) => ({ ...ret, [i.name]: typeGetterMap[i.type](i.name) }),
        {},
    )
}
