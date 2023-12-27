import { useStore } from "@/stores"
import { Input, message } from "antd"
import { observer } from "mobx-react-lite"
import { Children, InputHTMLAttributes, useEffect, useMemo, useState } from "react"
import Tree from "react-d3-tree"
import "./index.less"
import { debounce } from "lodash"

const TreeViewer = () => {
    const { globalStore: gs } = useStore()
    const [searchWords, setSearchWords] = useState("")

    useEffect(() => {}, [gs.dataSource, gs.isDarkMode])

    const data = useMemo(() => {
        try {
            return JSON.parse(gs.dataSource)
        } catch (e) {
            message.error("JSON格式有误，无法解析出树图")
            return {}
        }
    }, [gs.dataSource])

    // 后序深度优先遍历，为搜索命中的节点打上key，去除完全不包含的路径
    const dfsSearch = (tree: any, search: string) => {
        const dfs = (node: { name: string; path: string; children: any[]; isMatch?: boolean }) => {
            const matchChildren: any[] = node?.children?.map(dfs).filter(Boolean)

            if (node.name.toLowerCase().includes(search.toLowerCase())) {
                node.isMatch = true
                return node
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

        console.log("matchTree", dfsSearch(data, searchWords))
        return dfsSearch(data, searchWords) || { name: "Root", path: "NotFound" }
        // return data
    }, [searchWords, data])

    const handleCopyPath = (data: string) => {
        navigator.clipboard.writeText(data).then(() => {
            message.success("拷贝成功")
        })
    }

    const handleSearch = (e: any) => {
        debounce(() => setSearchWords(e.target.value), 800)()
    }

    const renderNode = ({ nodeDatum, toggleNode }: any) => (
        <g>
            <circle
                r={18}
                width="20"
                stroke="#1f77b4"
                fill={nodeDatum.children?.length ? "lightsteelblue" : "transparent"}
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
                        {nodeDatum.path}
                    </tspan>
                </text>
            </g>
            {/* <text strokeWidth="1" x="20" onClick={() => handleCopyPath(nodeDatum)}>
                <tspan dy="-5" dx={5} fontSize="14">
                    {nodeDatum.name}
                </tspan>
                <tspan dy="15" dx={5} x="20" fontSize="12">
                    {nodeDatum.path}
                </tspan>
            </text> */}
        </g>
    )

    return (
        <>
            <Input placeholder="输入关键字" className="w-full" onChange={handleSearch} />
            <Tree
                data={displayData}
                // onNodeClick={handleCopyPath}
                translate={{ x: 200, y: 250 }}
                renderCustomNodeElement={renderNode as any}
            />
        </>
    )
}

export default observer(TreeViewer)
