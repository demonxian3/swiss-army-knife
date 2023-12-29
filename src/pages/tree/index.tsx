import { useStore } from "@/stores"
import { Input, message } from "antd"
import { observer } from "mobx-react-lite"
import { useEffect, useMemo, useState } from "react"
import Tree from "react-d3-tree"
import "./index.less"
import { debounce, isObject } from "lodash"

const TreeViewer = () => {
    const { globalStore: gs } = useStore()
    const [searchWords, setSearchWords] = useState("")
    useEffect(() => {}, [gs.dataSource, gs.isDarkMode, gs.treeSettings.showReact])

    const filterTree = (tree: Record<string, any>) => {
        if (!gs.treeSettings.showAnt && gs.treeSettings.antFilter.includes(tree?.path)) {
            return null
        }

        let children = []
        if (tree?.children?.length) {
            children = tree.children.map(filterTree).filter(Boolean)
        }

        return { ...tree, children }
    }

    const data = useMemo(() => {
        try {
            return filterTree(JSON.parse(gs.dataSource)) || {}
        } catch (e) {
            console.log(e)
            message.error("JSON格式有误，无法解析出树图")
            return {}
        }
    }, [gs.dataSource, gs.treeSettings.showAnt])

    // 后序深度优先遍历，为搜索命中的节点打上key，去除完全不包含的路径
    const dfsSearch = (tree: any, search: string[]) => {
        const dfs = (node: { name: string; path: string; children: any[]; isMatch?: boolean }) => {
            const matchChildren: any[] = node?.children?.map(dfs).filter(Boolean)

            if (search?.some((s) => node.name.toLowerCase().includes(s.toLowerCase()))) {
                return { ...node, isMatch: true }
            }

            if (matchChildren?.length > 0) {
                return { ...node, children: matchChildren }
            }

            return null
        }

        return dfs(tree)
    }

    const displayData = useMemo(() => {
        if (!searchWords) {
            return data
        }

        return (
            dfsSearch(data, searchWords.split("|").filter(Boolean)) || {
                name: "Root",
                path: "NotFound",
            }
        )
        // return data
    }, [searchWords, data, gs.treeSettings.showAnt])

    const handleCopyPath = (data: string) => {
        navigator.clipboard.writeText(data).then(() => {
            message.success("拷贝成功")
        })
    }

    const handleSearch = (e: any) => {
        debounce(() => setSearchWords(e.target.value), 800)()
    }

    const getFillColor = (node: any) => {
        if (node.isMatch) return "#ff9632"
        return node.children?.length ? "lightsteelblue" : "transparent"
    }

    const renderCommonNode = ({ nodeDatum, toggleNode }: any) => {
        console.log(nodeDatum)
        return (
            <g>
                <circle
                    r={18}
                    width="20"
                    stroke="#1f77b4"
                    fill={getFillColor(nodeDatum)}
                    strokeWidth={2}
                    onClick={toggleNode}
                />
                <g className="rd3t-label">
                    <text
                        onClick={() => handleCopyPath(nodeDatum.name)}
                        className="rd3t-label__title"
                        textAnchor="start"
                        y="40"
                        style={{
                            fill: gs.isDarkMode ? "#fff" : "#444",
                        }}
                    >
                        {nodeDatum.name}
                    </text>
                    {Object.keys(nodeDatum)
                        .filter((k) => !["name", "children"].includes(k) && !isObject(nodeDatum[k]))
                        .map((key: string, index: number) => (
                            <text
                                key={key}
                                className="rd3t-label__attributes"
                                x="0"
                                y="40"
                                onClick={() => handleCopyPath(nodeDatum[key])}
                            >
                                <tspan x="0" dy={`${index + 1}em`}>
                                    {key}: {nodeDatum[key]}
                                </tspan>
                            </text>
                        ))}
                </g>
            </g>
        )
    }

    const renderReactNode = ({ nodeDatum, toggleNode }: any) => (
        <g>
            <circle
                r={18}
                width="20"
                stroke="#1f77b4"
                fill={getFillColor(nodeDatum)}
                strokeWidth={2}
                onClick={toggleNode}
            />
            <g className="rd3t-label">
                <text
                    onClick={() => handleCopyPath(nodeDatum.name)}
                    className="rd3t-label__title"
                    textAnchor="start"
                    y="40"
                    style={{
                        fill: gs.isDarkMode ? "#fff" : "#444",
                    }}
                >
                    {nodeDatum.name}
                </text>
                <text
                    className="rd3t-label__attributes"
                    x="0"
                    y="40"
                    onClick={() => handleCopyPath(nodeDatum.path)}
                >
                    <tspan x="0" dy="1.2em">
                        path: {nodeDatum.path}
                    </tspan>
                </text>
                {nodeDatum.routes?.map((route: any, index: number) => (
                    <text
                        key={route}
                        className="rd3t-label__attributes"
                        x="0"
                        y="40"
                        onClick={() => handleCopyPath(route)}
                    >
                        <tspan x="0" dy={`${2.4 + 1.2 * index}em`}>
                            route: {route}
                        </tspan>
                    </text>
                ))}
            </g>
        </g>
    )

    return (
        <>
            <Input placeholder="输入关键字" className="w-full" onChange={handleSearch} />
            <Tree
                data={displayData as any}
                // onNodeClick={handleCopyPath}
                translate={{ x: 200, y: 250 }}
                renderCustomNodeElement={
                    gs.treeSettings.showReact ? (renderReactNode as any) : renderCommonNode
                }
            />
        </>
    )
}

export default observer(TreeViewer)
