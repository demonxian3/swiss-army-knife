import { useState } from "react"
import "./index.less"

const Sidebar = () => {
    const [isExpanded, setExpanded] = useState(true)

    const toggleSidebar = () => {
        setExpanded(!isExpanded)
    }

    return (
        <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
            {/* 侧边工具栏内容 */}
            <div className="content">
                {/* 工具栏内容 */}
                <p>Tool 1</p>
                <p>Tool 2</p>
                {/* ...其他工具栏内容 */}
            </div>

            {/* 展开收缩按钮 */}
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isExpanded ? "收缩" : "展开"}
            </button>
        </div>
    )
}

export default Sidebar
