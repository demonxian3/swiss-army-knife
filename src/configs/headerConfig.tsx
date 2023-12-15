// import {
//     BarChartOutlined,
//     DribbbleOutlined,
//     AppstoreAddOutlined,
//     SettingOutlined,
// } from "@ant-design/icons"

export default  [
    {
        key: "home",
        label: "文本",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "json",
        label: "Json",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "code",
        label: "Code",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "diff",
        label: "对比",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "settings",
        label: "设置",
        // icon: <SettingOutlined />,
        children: [
            {
                type: "group",
                label: "主题",
                children: [
                    {
                        label: "明亮主题",
                        key: "light",
                    },
                    {
                        label: "暗黑主题",
                        key: "dark",
                    },
                ],
            },
        ],
    },
]