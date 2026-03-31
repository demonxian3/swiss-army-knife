import { useState, useMemo, ReactElement, useCallback } from "react"
import { Switch, Typography, Form } from "antd"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores"
import { useI18n } from "@/i18n"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import { useLocalStorage, useWindowSize } from "react-use"
import "./index.less" // 样式文件可以自定义

// const randomHue = Math.floor(Math.random() * 360)
const TreeBox = () => {
    const [showAnt, setShowAnt] = useLocalStorage("tree-show-ant", false)
    const [showReact, setShowReact] = useLocalStorage("tree-show-react", false)
    const [showDetail, setShowDetail] = useLocalStorage("tree-show-detail", false)

    const { globalStore: gs } = useStore()
    const { t } = useI18n()
    const { width: screenWidth } = useWindowSize()
    const isLaptop = useMemo(() => screenWidth <= 1440, [screenWidth])

    const updateShow = (key: string, setter: Function) => (checked: boolean) => {
        setter(checked)
        gs.setTreeSettings(key, checked)
    }

    return (
        <div className={`relative h-full`} style={{ transition: "width 0.3s ease-in-out" }}>
            <div className={`toolbox shadow flex relative ${gs.getToolboxWidth(isLaptop)}`}>
                <div className="w-28px h-full">
                    <button
                        onClick={() => gs.toggleToolExpand()}
                        className={`w-26px text-green-600 text-xl `}
                    >
                        {gs.toolBoxExpand ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </button>
                </div>
                <div className="w-full ">
                    <Typography className="text-gray-500 font-bold">{t("common.displaySettings")}</Typography>
                    <Form>
                        <Form.Item label={t("tree.showAntNodes")} className="mb-8px">
                            <Switch
                                checked={showAnt}
                                onChange={updateShow("showAnt", setShowAnt)}
                            />
                        </Form.Item>
                        <Form.Item label={t("tree.reactProjectTree")} className="mb-8px">
                            <Switch
                                checked={showReact}
                                onChange={updateShow("showReact", setShowReact)}
                            />
                        </Form.Item>
                        <Form.Item label={t("tree.showDetail")} className="mb-8px">
                            <Switch
                                checked={showDetail}
                                onChange={updateShow("showDetail", setShowDetail)}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default observer(TreeBox)
