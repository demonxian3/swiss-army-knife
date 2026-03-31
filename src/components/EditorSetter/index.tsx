import { observer } from "mobx-react-lite"
import { Select, Form, Switch, Button, Space } from "antd"
import { isNil } from "lodash"

interface ISetterProps {
    language: string | undefined
    wordWrap: boolean | undefined
    setLanguage: (x: string) => void
    setWordWrap: (x: boolean) => void
    onSync?: (which: string) => void
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
    const { onSync, diffSync, language, setLanguage, wordWrap, setWordWrap } = props

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
    }

    return (
        <Form layout="inline" size="small" className="editor-setter">
            <Form.Item label="语言">
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
            <Form.Item label="自动换行">
                <Switch checked={wordWrap} onChange={setWordWrap} size="small" />
            </Form.Item>
            {!isNil(diffSync) && (
                <Space>
                    <Button type="primary" danger onClick={() => onSync?.("left")}>同步左侧</Button>
                    <Button type="primary" onClick={() => onSync?.("right")}>同步右侧</Button>
                </Space>
            )}
        </Form>
    )
}

export default observer(EditorSetter)
