import { useStore } from "@/stores"
import { message } from "antd"
import { observer } from "mobx-react-lite"
import { useEffect, useMemo } from "react"
import Tree from "react-d3-tree"
import "./index.less"

const TreeViewer = () => {
    const { globalStore: gs } = useStore()

    useEffect(() => {}, [gs.dataSource, gs.isDarkMode])

    const data = useMemo(() => {
        try {
            return JSON.parse(gs.dataSource)
        } catch (e) {
            message.error("JSON格式有误，无法解析出树图")
            return {}
        }
    }, [gs.dataSource])

    const handleCopyPath = (data: string) => {
        navigator.clipboard.writeText(data).then(() => {
            message.success("拷贝成功")
        })
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
        <Tree
            data={data}
            // onNodeClick={handleCopyPath}
            translate={{ x: 200, y: 250 }}
            renderCustomNodeElement={renderNode as any}
        />
    )
}

export default observer(TreeViewer)
