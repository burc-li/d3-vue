import go from 'gojs'
import { clearEmptyBgText } from './utils'
import TextEditor from './textEditor'

function TextEditingTool () {
  go.TextEditingTool.call(this)
  // 编辑文本的触发方式
  this.starting = go.TextEditingTool.DoubleClick
  // 默认文本编辑器 - HTMLInfo
  this.defaultTextEditor = TextEditor
}
go.Diagram.inherit(TextEditingTool, go.TextEditingTool)

// Start editing the text for a textBlock
TextEditingTool.prototype.doActivate = function () {
  go.TextEditingTool.prototype.doActivate.call(this)
  if (this.textBlock || this.isActive) {
    const oldskips = this.diagram.skipsUndoManager
    this.diagram.skipsUndoManager = true
    if (this.textBlock) this.textBlock.opacity = 0.0
    this.diagram.skipsUndoManager = oldskips
  }
}

// Finish editing by trying to accept the new text
TextEditingTool.prototype.acceptText = function (reason) {
  go.TextEditingTool.prototype.acceptText.call(this, reason)
}

// Release the mouse
TextEditingTool.prototype.doDeactivate = function () {
  // this.diagram === this.textBlock.part.diagram
  const diagram = this.textBlock ? this.textBlock.part.diagram : null
  if (!diagram) return
  const oldskips = diagram.skipsUndoManager
  diagram.skipsUndoManager = true
  this.textBlock.opacity = 1
  diagram.skipsUndoManager = oldskips
  go.TextEditingTool.prototype.doDeactivate.call(this)
  clearEmptyBgText(window.diagram)
}

TextEditingTool.prototype.stopTool = function (noTranscation) {
  const newString = this.currentTextEditor && this.currentTextEditor.valueFunction()
  this.transactionResult = null
  if (this.oldString !== newString) {
    this.transactionResult = 'TextEditing'
    this.acceptText(go.TextEditingTool.MouseDown)
  } else {
    this.transactionResult = null
  }
  this.stopTransaction()
  go.TextEditingTool.prototype.stopTool.call(this)
  this.diagram.focus()
}

export default TextEditingTool
