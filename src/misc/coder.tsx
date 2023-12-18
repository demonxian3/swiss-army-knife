import dayjs from "dayjs"
import qs from "qs"

const codePair = [
    [0x08, 0x62],
    [0x09, 0x74],
    [0x0a, 0x6e],
    [0x0c, 0x66],
    [0x0d, 0x72],
    [0x22, 0x22],
    [0x2f, 0x2f],
    [0x5c, 0x5c],
]

const signMap = new Map<number, number>(codePair as Iterable<readonly [number, number]>)
const codeMap = new Map<number, number>(
    codePair.map((i) => [i[1], i[0]]) as Iterable<readonly [number, number]>,
)

// encodeURIComponent 对于字母会跳过编码，因此编写函数补充字母等相关编码
const urlEncode = (text: string) => {
    let skip = -1
    return Array.from(encodeURIComponent(text)).reduce((ret, c, i) => {
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

const base64Encode = (text: string) => {
    const bytes = new TextEncoder().encode(text)
    return btoa(String.fromCharCode(...bytes))
}

const base64Decode = (text: string) => {
    const decodedBytes = Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
    return new TextDecoder().decode(decodedBytes)
}

const hexEncode = (text: string) => {
    return Array.from(new TextEncoder().encode(text), (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("")
}

const hexDecode = (text: string) => {
    const bytes = text.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    return new TextDecoder().decode(new Uint8Array(bytes))
}

const unicodeEncode = (text: string): string => {
    return Array.from(text)
        .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
        .join("")
}

const unicodeDecode = (text: string): string => {
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

const entityEncode = (text: string, hex = true) => {
    return Array.from(text)
        .map((char) => `&#${hex ? "x" + char.charCodeAt(0).toString(16) : char.charCodeAt(0)};`)
        .join("")
}

const entityDecode = (text: string) => {
    return text
        .split(";")
        .map((entity) =>
            String.fromCharCode(
                entity[2] === "x" ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10),
            ),
        )
        .join("")
}

const toTimestamp = (text: string): string => {
    const parsedDate = dayjs(text)

    if (!parsedDate.isValid()) {
        throw new Error("非有效日期格式, 无法转换")
    }

    return parsedDate.unix().toString()
}

const toDatetime = (text: string): string => {
    const timestamp = text.length === 10 ? parseInt(text + "000", 10) : parseInt(text, 10)

    if (isNaN(timestamp)) {
        throw new Error("非有效时间戳格式，无法转换")
    }

    return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")
}

// 高亮显示错误的位置
const highlightJsonError = (error: any) => {
    const elem = document.querySelector("textarea") as HTMLTextAreaElement
    let posStart = -1
    let posEnd = -1

    const matches = [
        {
            reg: /\.{3}"(.*?)"\.{3}/,
            fn: (text: string) => {
                posStart = elem.value.indexOf(text)
                posEnd = posStart + text.length
            },
        },
        {
            reg: /at position (\d+) \(/,
            fn: (text: string) => {
                posStart = parseInt(text, 10)
                posEnd = posStart + 1
            },
        },
        {
            reg: /Unexpected token '(.*?)'/,
            fn: (text: string) => {
                posStart = elem.value.indexOf(text)
                posEnd = posStart + text.length
            },
        },
    ]

    matches.reduce((ret, cur) => {
        if (ret) return ret
        const errMatch = error.toString().match(cur.reg)
        if (errMatch?.length >= 2) {
            cur.fn(errMatch[1])
            return true
        }

        return false
    }, false)

    if (posStart >= 0 && posEnd > posStart) {
        elem.classList.add("highlight-orange")
        elem.focus()
        elem.setSelectionRange(posStart, posEnd)
        setTimeout(() => {
            elem.classList.remove("highlight-orange")
        }, 2000)
    }

    throw new Error(error.toString())
}

export const jsonFormat = (text: string): string => {
    try {
        const trimmedInput = text.trim()
        const parsedJSON = JSON.parse(trimmedInput)
        return JSON.stringify(parsedJSON, null, 4)
    } catch (error: any) {
        highlightJsonError(error)
        return ""
    }
}

export const jsonCompress = (text: string): string => {
    try {
        const trimmedInput = text.trim()
        const parsedJSON = JSON.parse(trimmedInput)
        return JSON.stringify(parsedJSON, null, 0)
    } catch (error: any) {
        highlightJsonError(error)
        return ""
    }
}

const paramSplit = (text: string): string => {
    return text.replace(/([?&])/gm, "\n$1")
}

const paramJoin = (text: string): string => {
    return text.replace(/\n([?&])/gm, "$1")
}

const noImplemented = () => {
    throw new Error("功能尚未开发")
}

const json2Param = (text: string) => {
    return qs.stringify(JSON.parse(jsonCompress(text)))
}

const param2Json = (text: string) => {
    return jsonFormat(JSON.stringify(qs.parse(text.replace(/\s/g, ""))))
}

const removeByReg = (spaceSign: RegExp) => (text: string) => text.replace(spaceSign, "")

// 按json格式转义
const escape = (text: string) =>
    new TextDecoder().decode(
        Uint8Array.from(
            Array.from(new TextEncoder().encode(text))
                .map((c) => {
                    const r = signMap.get(c)
                    if (r) {
                        return [0x5c, r]
                    }
                    return c
                })
                .flat(),
        ),
    )

const unescape = (text: string) =>
    Array.from(codeMap.keys()).reduce((str, c) => {
        return str.replace(
            new RegExp("\\\\" + (c === 0x5c ? "\\\\" : String.fromCodePoint(c)), "gm"),
            String.fromCodePoint(codeMap.get(c) as number),
        )
    }, text)

const quotedPrintableEncode = (text: string): string => {
    return Array.from(text)
        .map((c) => {
            const unicode = c.codePointAt(0) || -1

            if ((unicode >= 33 && unicode <= 60) || (unicode >= 62 && unicode <= 126)) {
                return c
            } else {
                return urlEncode(c).replaceAll("%", "=")
            }
        })
        .join("")
}

const quotedPrintableDecode = (text: string): string =>
    decodeURIComponent(text.replace(/=([0-9A-F]{2})/g, (_m, hex) => `%${hex}`).replace(/=\s/g, ""))

// TODO SQL排版，代码排版
export default [
    { type: "coder", label: "Escape编码", handler: encodeURIComponent },
    { type: "coder", label: "Escape解码", handler: decodeURIComponent },
    { type: "coder", label: "Url编码", handler: urlEncode },
    { type: "coder", label: "Url解码", handler: decodeURIComponent },
    { type: "coder", label: "邮件QP编码", handler: quotedPrintableEncode },
    { type: "coder", label: "邮件QP解码", handler: quotedPrintableDecode },
    { type: "coder", label: "Base64编码", handler: base64Encode },
    { type: "coder", label: "Base64解码", handler: base64Decode },
    { type: "coder", label: "Hex编码", handler: hexEncode },
    { type: "coder", label: "Hex解码", handler: hexDecode },
    { type: "coder", label: "Unicode编码", handler: unicodeEncode },
    { type: "coder", label: "Unicode解码", handler: unicodeDecode },
    { type: "coder", label: "实体编码", handler: entityEncode },
    { type: "coder", label: "实体解码", handler: entityDecode },
    { type: "coder", label: "转时间戳", handler: toTimestamp },
    { type: "coder", label: "转日期时间", handler: toDatetime },
    { type: "coder", label: "Json排版", handler: jsonFormat },
    { type: "coder", label: "Json压缩", handler: jsonCompress },
    // { type: "coder", label: "SQL排版", handler: noImplemented },
    // { type: "coder", label: "SQL压缩", handler: noImplemented },
    { type: "coder", label: "转义", handler: escape },
    { type: "coder", label: "反转义", handler: unescape },
    { type: "coder", label: "参数分行", handler: paramSplit },
    { type: "coder", label: "参数并行", handler: paramJoin },
    { type: "coder", label: "去除空格", handler: removeByReg(/ /g) },
    { type: "coder", label: "去除空白", handler: removeByReg(/\s/g) },
    { type: "coder", label: "param转json", handler: param2Json },
    { type: "coder", label: "Json转param", handler: json2Param },
]
