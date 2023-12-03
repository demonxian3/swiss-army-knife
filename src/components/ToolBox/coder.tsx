// encodeURIComponent 对于字母会跳过编码，因此编写函数补充字母等相关编码
const urlEncode = (str: string) => {
    let skip = -1
    return Array.from(encodeURIComponent(str)).reduce((ret, c, i) => {
        if (c === "%") {
            skip = i + 2
        }

        if (i <= skip) return ret + c

        const unicode = c.codePointAt(0) || -1
        if (unicode >= 0 && unicode < 128) {
            ret += "%" + unicode.toString(16).toUpperCase()
        }

        return ret
    }, "")
}

const base64Encode = (input: string) => {
    const bytes = new TextEncoder().encode(input)
    return btoa(String.fromCharCode(...bytes))
}

const base64Decode = (input: string) => {
    const decodedBytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0))
    return new TextDecoder().decode(decodedBytes)
}

function hexEncode(input: string) {
    return Array.from(new TextEncoder().encode(input), (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("")
}

function hexDecode(hex: string) {
    const bytes = hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    return new TextDecoder().decode(new Uint8Array(bytes))
}

export default [
    { type: "coder", label: "Escape编码", handler: encodeURIComponent },
    { type: "coder", label: "Escape解码", handler: decodeURIComponent },
    { type: "coder", label: "Url编码", handler: urlEncode },
    { type: "coder", label: "Url解码", handler: decodeURIComponent },
    { type: "coder", label: "Base64编码", handler: base64Encode },
    { type: "coder", label: "Base64解码", handler: base64Decode },
    { type: "coder", label: "Hex编码", handler: hexEncode },
    { type: "coder", label: "Hex解码", handler: hexDecode },
    { type: "coder", label: "Unicode编码", handler: "unicodeEncode" },
    { type: "coder", label: "Unicode解码", handler: "unicodeDecode" },
    { type: "coder", label: "实体编码", handler: "entityEncode" },
    { type: "coder", label: "实体解码", handler: "entityDecode" },
    { type: "coder", label: "转时间戳", handler: "toTimestamp" },
    { type: "coder", label: "转日期时间", handler: "toDateTime" },
    { type: "coder", label: "邮件编码", handler: "quotePrintEncode" },
    { type: "coder", label: "邮件解码", handler: "quotePrintDecode" },
]
