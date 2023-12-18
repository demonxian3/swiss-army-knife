export const addSelectListener = (editor: any, gs: any, monaco: any) =>
    editor.onDidChangeCursorSelection(() => {
        // 获取所有选中的文本范围
        // 记录选中信息
        const edits: { range: any; text: string }[] = []
        editor.getSelections().forEach((selection: any) => {
            const { startLineNumber, endLineNumber, startColumn, endColumn } = selection

            if (startColumn !== endColumn || startLineNumber !== endLineNumber) {
                edits.push({
                    range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                    text: editor.getModel().getValueInRange(selection),
                })
            }
        })

        if (edits.length) {
            gs.setDataSourceUpdater((fn: Function) => {
                const multiUpdateEdits = edits.map(({ range, text }) => ({
                    range,
                    text: fn(text),
                }))
                editor.getModel().applyEdits(multiUpdateEdits)
                // editor.setSelection(null)
            })
        } else {
            gs.setDataSourceUpdater((fn: Function) => gs.setDataSource(fn(gs.dataSource)))
        }
    })
