import { getFieldsValue } from "./utils"
import { Select, Space, Button, Form, Segmented, Input, Divider } from "antd"
import crypto from "crypto-js"

const md5 = (text: string): string => {
    return crypto.MD5(text).toString()
}

const sha1 = (text: string): string => {
    return crypto.SHA1(text).toString()
}

const sha256 = (text: string): string => {
    return crypto.SHA256(text).toString()
}

const sha512 = (text: string): string => {
    return crypto.SHA512(text).toString()
}

const fields = [
    {
        name: "mode",
        label: "模式",
        type: "select",
        options: ["ECB", "CFB", "CTR", "OFB", "CBC", "CTRGladman"],
        defaultValue: "ECB",
    },
    {
        name: "padding",
        label: "填充",
        type: "select",
        options: ["ZeroPadding", "NoPadding", "Pkcs7", "Ansix923", "Iso10126", "Iso97971"],
        defaultValue: "Pkcs7",
    },
    {
        name: "key",
        label: "密钥",
        type: "input",
        defaultValue: "",
    },
    {
        name: "iv",
        label: "IV",
        type: "input",
        defaultValue: "",
    },
    {
        name: "charset",
        label: "字集",
        type: "segmented",
        options: ["Utf8", "Latin1"],
        defaultValue: "Utf8",
    },
    {
        name: "encode",
        label: "填充",
        type: "segmented",
        options: ["Base64", "Hex"],
        defaultValue: "Base64",
    },
]

const encrypt = (label: string, helper: typeof crypto.AES, handleMessage: Function) => {
    const { charset, encode, mode, padding, iv, key } = getFieldsValue(fields)
    const parseKey = (crypto.enc as any)[charset].parse(key)
    const config = {
        // iv: (crypto.enc as any)[charset].parse(iv || key),
        mode: (crypto.mode as any)[mode],
        encoding: (crypto.enc as any)[charset],
        padding: (crypto.pad as any)[padding],
    }

    const handler = (text: string) => {
        const input = (crypto.enc as any)[charset].parse(text)
        const res = helper.encrypt(input, parseKey, config).ciphertext
        return encode === "Base64" ? crypto.enc.Base64.stringify(res) : res.toString()
    }

    // 高阶函数调用
    return handleMessage({ label: `${label}加密`, handler, helper })()
}

const decrypt = (label: string, helper: typeof crypto.AES, handleMessage: Function) => {
    const { charset, encode, mode, padding, iv, key } = getFieldsValue(fields)
    const config = {
        key: (crypto.enc as any)[charset].parse(key),
        // iv: (crypto.enc as any)[charset].parse(iv || key),
        mode: (crypto.mode as any)[mode],
        // encoding: (crypto.enc as any)[charset],
        padding: (crypto.pad as any)[padding],
    }

    const handler = (text: string) => {
        const input = crypto.lib.CipherParams.create({
            ciphertext: (crypto.enc as any)[encode].parse(text),
        })
        return helper.decrypt(input, config.key, config).toString((crypto.enc as any)[charset])
    }

    // 高阶函数调用
    return handleMessage({ label: `${label}解密`, handler, helper })()
}

const showConfig = (
    setSettingDom: any,
    handleMessage: Function,
    item: { label: string; helper: typeof crypto.AES },
    isLaptop: boolean,
) => {
    const list2Options = (arr: string[]) =>
        arr.map((i) => ({
            value: i,
            label: i,
        }))

    setSettingDom(
        <>
            <Divider orientation={"center"}>{item.label}</Divider>
            <Form
                size={isLaptop ? "small" : "middle"}
                className="px-2 crypt-settings"
                colon={false}
                labelCol={{ span: 5 }}
            >
                {fields.map((item) => (
                    <Form.Item label={item.label} name={item.name}>
                        {item.type === "select" && (
                            <Select
                                options={list2Options(item.options || [])}
                                defaultValue={item.defaultValue}
                            />
                        )}
                        {item.type === "input" && <Input defaultValue={item.defaultValue} />}
                        {item.type === "segmented" && (
                            <Segmented
                                defaultValue={item.defaultValue}
                                options={item.options || []}
                            />
                        )}
                    </Form.Item>
                ))}
                <center>
                    <Space className="mt-2" size={30}>
                        <Button
                            size={isLaptop ? "small" : "middle"}
                            type="primary"
                            onClick={() => encrypt(item.label, item.helper, handleMessage)}
                        >
                            加密
                        </Button>
                        <Button
                            size={isLaptop ? "small" : "middle"}
                            type="primary"
                            onClick={() => decrypt(item.label, item.helper, handleMessage)}
                        >
                            解密
                        </Button>
                    </Space>
                </center>
            </Form>
        </>,
    )
}

export default [
    { type: "crypter", label: "MD5", handler: md5 },
    { type: "crypter", label: "SHA-1", handler: sha1 },
    { type: "crypter", label: "SHA-256", handler: sha256 },
    { type: "crypter", label: "SHA-512", handler: sha512 },
    { type: "crypter", label: "AES", handler: showConfig, helper: crypto.AES },
    { type: "crypter", label: "DES", handler: showConfig, helper: crypto.DES },
    { type: "crypter", label: "3DES", handler: showConfig, helper: crypto.TripleDES },
]
