// import {
//     BarChartOutlined,
//     DribbbleOutlined,
//     AppstoreAddOutlined,
//     SettingOutlined,
// } from "@ant-design/icons"

export default  [
    {
        key: "home",
        label: "Code",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "json",
        label: "Json",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "diff",
        label: "Diff",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "tree",
        label: "Tree",
        // icon: <DribbbleOutlined />,
    },
    {
        key: "settings",
        label: "Setting",
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