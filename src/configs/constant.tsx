export const SELECTOR_DATAAREA = "#dataArea"
export const SELECTOR_JSONAREA = ".variable-editor"

export const routeSelectorMap = {
    "/home": SELECTOR_DATAAREA,
    "/json": SELECTOR_JSONAREA,
}

export const defaultDataSource = {
    name: "Root",
    type: "root",
    path: "App.tsx",
    specifier: "App",
    rootPath: "C:/Users/demon/Desktop/swiss-army-knife/src",
    children: [
        {
            name: "ConfigProvider",
            path: "antd",
            specifier: "ConfigProvider",
            type: "elem",
        },
        {
            name: "RouterProvider",
            path: "react-router-dom",
            specifier: "RouterProvider",
            type: "elem",
            children: [
                {
                    name: "router",
                    path: "router\\routes.tsx",
                    specifier: "router",
                    type: "prop",
                    children: [
                        {
                            name: "Suspense",
                            path: "react",
                            specifier: "Suspense",
                            type: "elem",
                        },
                        {
                            name: "Route",
                            path: "configs\\routeConfig.tsx",
                            specifier: "routes",
                            type: "other",
                            children: [
                                {
                                    name: "Base",
                                    path: "layouts\\base\\index.tsx",
                                    specifier: "Base",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "Layout",
                                            path: "antd",
                                            specifier: "Layout",
                                            type: "elem",
                                        },
                                        {
                                            name: "Header",
                                            path: "layouts\\index.tsx",
                                            specifier: "Header",
                                            type: "elem",
                                            children: [],
                                        },
                                        {
                                            name: "Layout",
                                            path: "antd",
                                            specifier: "Layout",
                                            type: "elem",
                                        },
                                        {
                                            name: "ToolBox",
                                            path: "components\\index.tsx",
                                            specifier: "ToolBox",
                                            type: "elem",
                                            children: [],
                                        },
                                        {
                                            name: "Outlet",
                                            path: "react-router-dom",
                                            specifier: "Outlet",
                                            type: "elem",
                                        },
                                        {
                                            name: "HistoryPanel",
                                            path: "components\\index.tsx",
                                            specifier: "HistoryPanel",
                                            type: "elem",
                                            children: [],
                                        },
                                    ],
                                },
                                {
                                    name: "Home",
                                    path: "pages\\home\\index.tsx",
                                    specifier: "Home",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "CodeArea",
                                            path: "pages\\code\\index.tsx",
                                            specifier: "CodeArea",
                                            type: "elem",
                                            children: [
                                                {
                                                    name: "EditorSetter",
                                                    path: "components\\EditorSetter\\index.tsx",
                                                    specifier: "EditorSetter",
                                                    type: "elem",
                                                    children: [
                                                        {
                                                            name: "Form",
                                                            path: "antd",
                                                            specifier: "Form",
                                                            type: "elem",
                                                        },
                                                        {
                                                            name: "Select",
                                                            path: "antd",
                                                            specifier: "Select",
                                                            type: "elem",
                                                        },
                                                        {
                                                            name: "Switch",
                                                            path: "antd",
                                                            specifier: "Switch",
                                                            type: "elem",
                                                        },
                                                        {
                                                            name: "Space",
                                                            path: "antd",
                                                            specifier: "Space",
                                                            type: "elem",
                                                        },
                                                        {
                                                            name: "Button",
                                                            path: "antd",
                                                            specifier: "Button",
                                                            type: "elem",
                                                        },
                                                        {
                                                            name: "Button",
                                                            path: "antd",
                                                            specifier: "Button",
                                                            type: "elem",
                                                        },
                                                    ],
                                                },
                                                {
                                                    name: "Editor",
                                                    path: "@monaco-editor/react",
                                                    specifier: "Editor",
                                                    type: "elem",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: "JsonEditor",
                                    path: "pages\\json\\index.tsx",
                                    specifier: "JsonEditor",
                                    type: "elem",
                                    children: [],
                                },
                                {
                                    name: "CodeEditor",
                                    path: "pages\\code\\index.tsx",
                                    specifier: "CodeEditor",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "EditorSetter",
                                            path: "components\\EditorSetter\\index.tsx",
                                            specifier: "EditorSetter",
                                            type: "elem",
                                            children: [
                                                {
                                                    name: "Form",
                                                    path: "antd",
                                                    specifier: "Form",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Select",
                                                    path: "antd",
                                                    specifier: "Select",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Switch",
                                                    path: "antd",
                                                    specifier: "Switch",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Space",
                                                    path: "antd",
                                                    specifier: "Space",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Button",
                                                    path: "antd",
                                                    specifier: "Button",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Button",
                                                    path: "antd",
                                                    specifier: "Button",
                                                    type: "elem",
                                                },
                                            ],
                                        },
                                        {
                                            name: "Editor",
                                            path: "@monaco-editor/react",
                                            specifier: "Editor",
                                            type: "elem",
                                        },
                                    ],
                                },
                                {
                                    name: "DiffEditor",
                                    path: "pages\\diff\\index.tsx",
                                    specifier: "DiffEditor",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "EditorSetter",
                                            path: "components\\EditorSetter\\index.tsx",
                                            specifier: "EditorSetter",
                                            type: "elem",
                                            children: [
                                                {
                                                    name: "Form",
                                                    path: "antd",
                                                    specifier: "Form",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Select",
                                                    path: "antd",
                                                    specifier: "Select",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Switch",
                                                    path: "antd",
                                                    specifier: "Switch",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Space",
                                                    path: "antd",
                                                    specifier: "Space",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Button",
                                                    path: "antd",
                                                    specifier: "Button",
                                                    type: "elem",
                                                },
                                                {
                                                    name: "Button",
                                                    path: "antd",
                                                    specifier: "Button",
                                                    type: "elem",
                                                },
                                            ],
                                        },
                                        {
                                            name: "DiffEditor",
                                            path: "@monaco-editor/react",
                                            specifier: "DiffEditor",
                                            type: "elem",
                                        },
                                    ],
                                },
                                {
                                    name: "TreeViewer",
                                    path: "pages\\tree\\index.tsx",
                                    specifier: "TreeViewer",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "Tree",
                                            path: "react-d3-tree",
                                            specifier: "Tree",
                                            type: "elem",
                                        },
                                    ],
                                },
                                {
                                    name: "NotFound",
                                    path: "pages\\error\\notFound.tsx",
                                    specifier: "NotFound",
                                    type: "elem",
                                    children: [
                                        {
                                            name: "Result",
                                            path: "antd",
                                            specifier: "Result",
                                            type: "elem",
                                        },
                                        {
                                            name: "Button",
                                            path: "antd",
                                            specifier: "Button",
                                            type: "elem",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
    