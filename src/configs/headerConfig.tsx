// import {
//     BarChartOutlined,
//     DribbbleOutlined,
//     AppstoreAddOutlined,
//     SettingOutlined,
// } from "@ant-design/icons"

const getHeaderConfig = (t: (key: string) => string) => [
    {
        key: "home",
        label: t("nav.home"),
    },
    {
        key: "json",
        label: t("nav.json"),
    },
    {
        key: "diff",
        label: t("nav.diff"),
    },
    {
        key: "tree",
        label: t("nav.tree"),
    },
    {
        key: "settings",
        label: t("nav.settings"),
    },
]

export default getHeaderConfig
