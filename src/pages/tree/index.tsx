import { useStore } from "@/stores"
import { message } from "antd"
import { observer } from "mobx-react-lite"
import { useMemo } from "react"
import Tree from "react-d3-tree"



const TreeViewer = () => {
    const { globalStore: gs } = useStore()

    const data = useMemo(() => {
        try {
            return JSON.parse(gs.dataSource)
        } catch (e) {
            message.error("JSON格式有误，无法解析出树图")
            return {}
        }
    }, [gs.dataSource])

    const handleClick = (node: any) => {
        const prefixPath = data?.attributes?.rootPath
        navigator.clipboard.writeText(node.data.attributes.path.replace(prefixPath, ""))
    }

    return <Tree data={data} onNodeClick={handleClick} />
}

export default observer(TreeViewer)
