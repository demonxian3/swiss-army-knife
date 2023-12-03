import urlcoder from "urlencode";

const urlEncode = (str: string) => {

    

}

const urlDecode = (str: string) => {}
export default [
    { type: "coder", label: "Escape编码", handler: encodeURIComponent },
    { type: "coder", label: "Escape解码", handler: decodeURIComponent },
    { type: "coder", label: "Url编码", handler: urlEncode },
    { type: "coder", label: "Url解码", handler: urlDecode },
    { type: "coder", label: "Base64编码", handler: "b64Encode" },
    { type: "coder", label: "Base64解码", handler: "b64Decode" },
    { type: "coder", label: "Hex编码", handler: "hexEncode" },
    { type: "coder", label: "Hex解码", handler: "hexDecode" },
    { type: "coder", label: "Unicode编码", handler: "unicodeEncode" },
    { type: "coder", label: "Unicode解码", handler: "unicodeDecode" },
    { type: "coder", label: "实体编码", handler: "entityEncode" },
    { type: "coder", label: "实体解码", handler: "entityDecode" },
    { type: "coder", label: "转时间戳", handler: "toTimestamp" },
    { type: "coder", label: "转日期时间", handler: "toDateTime" },
    { type: "coder", label: "邮件编码", handler: "quotePrintEncode" },
    { type: "coder", label: "邮件解码", handler: "quotePrintDecode" },
]
