import { useEffect, useMemo, useRef } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { useWindowSize } from "react-use"
import "./index.less"
import { diffWords } from "diff"
import { debounce, isNil } from "lodash"

const DiffEditor = () => {
    const { globalStore: gs } = useStore()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const leftRef = useRef<HTMLDivElement | null>(null)
    const rightRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        handleChange()
    }, [])

    const handleChange = debounce(() => {
        if ([leftRef?.current?.textContent, rightRef?.current?.textContent].some(isNil)) {
            return
        }
        
        var a = document.createDocumentFragment()
        var b = document.createDocumentFragment()

        const diffs = diffWords(leftRef.current.textContent, rightRef.current.textContent)

        diffs.forEach((d) => {
            if (d.removed) {
                const node = document.createElement("del")
                node.appendChild(document.createTextNode(d.value))
                a.appendChild(node)
            } else if (d.added) {
                const node = document.createElement("ins")
                node.appendChild(document.createTextNode(d.value))
                b.appendChild(node)
            } else {
                a.appendChild(document.createTextNode(d.value))
                b.appendChild(document.createTextNode(d.value))
            }
        })

        leftRef.current.textContent = rightRef.current.textContent = ""
        leftRef.current.appendChild(a)
        rightRef.current.appendChild(b)
    }, 800)

    return (
        <div
            className={`diff-container ${isLaptop ? "text-size-14px" : "text-size-16px"}  ${
                gs.isDarkMode ? "diff-theme-dark" : "diff-theme-light"
            }`}
        >
            <div className="diff-left" ref={leftRef} contentEditable onInput={handleChange}></div>
            <div className="diff-right" ref={rightRef} contentEditable onInput={handleChange}></div>
        </div>
    )
}

export default observer(DiffEditor)
