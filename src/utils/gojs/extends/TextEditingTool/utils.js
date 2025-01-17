// 清空bgText
export function clearEmptyBgText (diagram) {
  const emptyBgText = diagram.selection.copy().first()
  if (emptyBgText) {
    const { category, label } = emptyBgText.data
    if (category === 'bgText' && !label) {
      const oldSkips = diagram.skipsUndoManager
      diagram.skipsUndoManager = false
      diagram.startTransaction('clearEmptyBgText')
      diagram.remove(emptyBgText)
      diagram.commitTransaction('clearEmptyBgText')
      diagram.skipsUndoManager = oldSkips
    }
  }
}

export function clearToolTip (diagram) {
  let toolTipPart
  diagram.parts.each(iPart => {
    if (iPart.locationObjectName === 'nodeDraggingToolTipPart') {
      toolTipPart = iPart
      diagram.remove(iPart)
    }
  })
  return toolTipPart
}
