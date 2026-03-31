import { ReactNode } from "react"
import { observer } from "mobx-react-lite"
import { Select, Form, Switch, Button, Space } from "antd"
import { isNil } from "lodash"
import { useI18n } from "@/i18n"

interface ISetterProps {
    language: string | undefined
    wordWrap: boolean | undefined
    diffSync?: number
    setLanguage: (x: string) => void
    setWordWrap: (x: boolean) => void
    onSync?: (which: string) => void
    extraActions?: ReactNode
}

const supportLanguages = [
    "plaintext",
    "java",
    "javascript",
    "typescript",
    "json",
    "xml",
    "python",
    "bash",
    "html",
    "css",
    "go",
    "markdown",
]

const EditorSetter: React.FC<ISetterProps> = (props) => {
    const { onSync, diffSync, language, setLanguage, wordWrap, setWordWrap, extraActions } = props
    const { t } = useI18n()

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
    }

    return (
        <div className="editor-toolbar">
            <Form layout="inline" size="small" className="editor-setter">
                <Form.Item label={t("common.language")}>
                    <Select
                        value={language}
                        style={{ width: "120px" }}
                        size="small"
                        onChange={handleLanguageChange}
                        options={supportLanguages.map((i) => ({
                            label: i,
                            value: i,
                        }))}
                    ></Select>
                </Form.Item>
                <Form.Item label={t("editor.wordWrap")}>
                    <Switch checked={wordWrap} onChange={setWordWrap} size="small" />
                </Form.Item>
                {!isNil(diffSync) && (
                    <Space>
                        <Button type="primary" danger onClick={() => onSync?.("left")}>{t("editor.syncLeft")}</Button>
                        <Button type="primary" onClick={() => onSync?.("right")}>{t("editor.syncRight")}</Button>
                    </Space>
                )}
            </Form>
            {extraActions}
        </div>
    )
}

export default observer(EditorSetter)
