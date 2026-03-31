import { observer } from "mobx-react-lite"
import { Card, Form, Segmented, Typography } from "antd"
import { useStore } from "@/stores"
import { useI18n } from "@/i18n"

const SettingsPage = () => {
    const { globalStore } = useStore()
    const { t } = useI18n()

    return (
        <div className="p-12px">
            <Card title={t("settings.title")}>
                <Typography.Paragraph type="secondary">
                    {t("settings.description")}
                </Typography.Paragraph>

                <Form layout="vertical">
                    <Form.Item
                        label={t("common.language")}
                        extra={t("settings.languageDescription")}
                    >
                        <Segmented
                            value={globalStore.localeKey}
                            options={[
                                { label: t("common.chinese"), value: "cn" },
                                { label: t("common.english"), value: "en" },
                            ]}
                            onChange={(value) => globalStore.changeLocale(value as "cn" | "en")}
                        />
                    </Form.Item>

                    <Form.Item label={t("common.theme")} extra={t("settings.themeDescription")}>
                        <Segmented
                            value={globalStore.themeTag}
                            options={[
                                { label: t("common.lightTheme"), value: "light" },
                                { label: t("common.darkTheme"), value: "dark" },
                            ]}
                            onChange={(value) => globalStore.changeTheme(value as string)}
                        />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default observer(SettingsPage)
