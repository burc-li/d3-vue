/* eslint-disable */
'use strict'
import go from 'gojs'
import './customExtends.js'

/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 *  必须将 diagram 赋值给 window 对象
 */

var textarea = document.createElement('textarea')
textarea.id = 'myTextArea'

textarea.setAttribute('spellcheck', false)

textarea.addEventListener(
  'input',
  function(e) {
    var tool = TextEditor.tool
    if (!tool || tool.textBlock === null) return
    TextEditor.updateTempTextBlock()
    TextEditor.updatePartBounds(tool.textBlock)
    TextEditor.updateTextareaBounds(tool.textBlock)
  },
  false,
)

// 触发鼠标滚轮事件时，stopTool
textarea.addEventListener('mousewheel', e => {
  e.preventDefault()
  const tool = TextEditor.tool
  if (diagram.currentTool.name === 'TextEditing') {
    tool.diagram.currentTool.stopTool()
  }
})

// 阻止右击鼠标时打开上下文菜单
textarea.addEventListener('contextmenu', e => {
  e.preventDefault()
})

// 键盘的键被按下时
textarea.addEventListener(
  'keydown',
  function(e) {
    this.className = ''
    var tool = TextEditor.tool
    if (!tool || tool.textBlock === null) return
    var keynum = e.which
    switch (keynum) {
      case 13:
        if (tool.textBlock.isMultiline === false) e.preventDefault()
        if (e.ctrlKey || e.metaKey) {
          if (tool.textBlock.isMultiline) {
            var _text = this.value
            var start = textarea.selectionStart
            _text = this.value.slice(0, start) + '\n' + this.value.slice(start)
            e.preventDefault()
            this.value = _text
            textarea.selectionStart = start + 1
            textarea.selectionEnd = start + 1
            TextEditor.updateTempTextBlock()
            TextEditor.updatePartBounds(tool.textBlock)
            TextEditor.updateTextareaBounds(tool.textBlock)
          }
        }
        tool.acceptText(go.TextEditingTool.Enter)
        break
      case 9:
        tool.acceptText(go.TextEditingTool.Tab)
        e.preventDefault()
        break
      case 27:
        tool.doCancel()
        if (tool.diagram !== null) tool.diagram.doFocus()
        break
      case 48: // the plus/equals key chrome/ie
      case 96: // in keypad
        this.className = 'mousetrap'
        break
      case 187: // the plus/equals key chrome/ie
      case 61: // the plus/equals key firefox
      case 107: //  in keypad
        this.className = 'mousetrap'
        break
      case 189: // the minus/underscore key chrome/ie
      case 173: // the minus/underscore key firefox
      case 109: //  in keypad
        this.className = 'mousetrap'
        break
      default:
        if (e.ctrlKey || e.metaKey) {
          if (/^(z|y)$/i.test(e.key) || /^(89|90)$/i.test(e.keyCode)) {
            // e.preventDefault()
            // console.log('tool.diagram.div', tool.diagram.div)
            // const canvas = tool.diagram.div.querySelector('canvas')
            // const keyboardEvent = new KeyboardEvent('keydown', e)
            // canvas.dispatchEvent(keyboardEvent)
          }
        }
        break
    }
  },
  false,
)

// 失焦
textarea.addEventListener(
  'blur',
  function(e) {
    const tool = TextEditor.tool
    if (diagram.currentTool.name === 'TextEditing') {
      tool.diagram.currentTool.stopTool()
      
    }
  },
  false,
)

var TextEditor = new go.HTMLInfo()

// Gets or sets a function that returns the primary value associated with this HTMLInfo, such as the string value of a text editor, which would be solicited by the TextEditingTool.
TextEditor.valueFunction = function() {
  return textarea.value
}

TextEditor.tempText = function() {
  return TextEditor._tempText
}

// Gets or sets the primary HTML Element that represents this HTMLInfo
TextEditor.mainElement = textarea

// Initialize
TextEditor.tool = null

TextEditor.show = function(textBlock, diagram, tool) {
  if (!(textBlock instanceof go.TextBlock)) return

  TextEditor.tool = tool // remember the TextEditingTool for use by listeners
  TextEditor.originalString = textBlock.text

  // This is called during validation, if validation failed:
  if (tool.state === go.TextEditingTool.StateInvalid) {
    textarea.style.border = '3px solid red'
    textarea.focus()
    return
  }
  var angle = textBlock.getDocumentAngle()

  // This part is called during initalization:
  var tmp = textBlock.panel
  for (; tmp.panel && !tmp.data; ) {
    tmp = tmp.panel
  }
  if (tmp && tmp.data) {
    tmp.data.height
    if (!tmp.data.textOriginalHeight && tmp.data.height) {
      tmp.data.textOriginalHeight = tmp.data.height
    }
    // 初始高度
    if (tmp.data.textOriginalHeight) {
      TextEditor.minHeight = tmp.data.textOriginalHeight
    }
    TextEditor.nodeData = tmp.data
  }

  // textBlock的中心点 在文档坐标中的点
  var loc = textBlock.getDocumentPoint(go.Spot.Center)
  var panelBounds = TextEditor.getPanelBounds(textBlock)
  // textBlock的中心点 在文档坐标中的点
  TextEditor.loc = loc
  // textBlock的panel 在文档坐标中的Rect
  TextEditor.panelBounds = panelBounds
  var sc = diagram.scale
  TextEditor.sc = sc
  var textscale = textBlock.getDocumentScale() * sc

  var paddingsize = 0
  TextEditor.paddingsize = paddingsize

  // 初始行数
  TextEditor.originalLineCount = textBlock.lineCount

  // textBlock宽度
  var textwidth = textBlock.naturalBounds.width
  var textheight = textBlock.naturalBounds.height + 2

  textarea.value = textBlock.text
  // the only way you can mix font and fontSize is if the font inherits and the fontSize overrides
  // in the future maybe have textarea contained in its own div
  diagram.div.style['font'] = textBlock.font

  var textareaPadding = '0px'

  var decoration = textBlock.isUnderline ? 'underline' : 'none'

  textarea.style.cssText =
    'position: absolute;' +
    'z-index: 100;' +
    'font: inherit;' +
    'font-size: 100%' +
    'line-height: ' +
    textheight / textBlock.lineCount +
    'px;' +
    'text-align: ' +
    textBlock.textAlign +
    ';' +
    'margin: 0;' +
    'padding: ' +
    textareaPadding +
    ';' +
    'border: 0;' +
    'outline: none;' +
    'resize: none;' +
    'white-space: pre-wrap;' +
    'overflow: hidden;' +
    'transform: scale(' +
    textscale +
    ', ' +
    textscale +
    ') rotate(' +
    angle +
    'deg);' +
    'background-color: transparent;' + // for proper IE wrap
    'color: ' +
    textBlock.stroke +
    ';' +
    'text-decoration: ' +
    decoration +
    ';' +
    'border: 1px solid #409eff;' +
    'word-break: break-all;'

  this.updateTempTextBlock()
  this.updateTextareaBounds(textBlock)

  textarea.textScale = textscale // attach a value to the textarea, for convenience

  // Show
  diagram.div.appendChild(textarea)

  // After adding, focus
  textarea.focus()
  if (tool.selectsTextOnActivate) {
    textarea.select()
  }
}

TextEditor.hide = function(diagram, tool) {
  diagram.div.removeChild(textarea)
  TextEditor.tool = null // forget reference to TextEditingTool
}

TextEditor.updateTempTextBlock = function() {
  if (!TextEditor.tool) return
  var tool = TextEditor.tool
  // 创建一个临时TextBlock，用于在编辑期间测量文本
  TextEditor._tempText = tool.measureTemporaryTextBlock(textarea.value)
}

// 更新自定义文本框宽高位置 width、height、left、top
TextEditor.updateTextareaBounds = function(textBlock) {
  if (!(textBlock instanceof go.TextBlock)) return
  var sc = TextEditor.sc
  var paddingsize = TextEditor.paddingsize
  var tempText = this.tempText()
  // textBlock的中心点 在文档坐标中的点
  var loc = TextEditor.loc
  // the coordinates of this Diagram in the viewport
  var pos = diagram.position
  var textwidth = tempText.naturalBounds.width + 2
  var textheight = tempText.naturalBounds.height + 2
  // 文本框的中心点距离左侧diagram边框的距离
  var left = (loc.x - pos.x) * sc
  // 文本框的中心点距离顶部diagram边框的距离
  var top = (loc.y - pos.y) * sc
  var lineHeight = textheight / tempText.lineCount
  lineHeight = Number(lineHeight.toFixed(4))

  textarea.style.left = ((left - textwidth / 2) | 0) - paddingsize + 'px'
  textarea.style.top = ((top - textheight / 2) | 0) - paddingsize + 'px'
  textarea.style.width = textwidth + 'px'
  textarea.style.height = Math.ceil(Math.max(textheight, lineHeight * tempText.lineCount)) + 'px'
  textarea.style.lineHeight = lineHeight + 'px'
}

TextEditor.updatePartBounds = function(textBlock) {
  if (!(textBlock instanceof go.TextBlock)) return
  var part = textBlock.part
  var nodeData = TextEditor.nodeData
  if (!part || !nodeData) return

  if (
    (textBlock.alignment.y === 0 && textBlock.alignmentFocus.y === 1) ||
    (textBlock.alignment.y === 1 && textBlock.alignmentFocus.y === 0)
  )
    return

  var panelBounds = TextEditor.panelBounds
  var tempText = this.tempText()

  if (tempText.lineCount !== TextEditor.originalLineCount) {
    var lineHeight = tempText.naturalBounds.height / tempText.lineCount
    var oriHeight = TextEditor.originalLineCount * lineHeight
    TextEditor.originalLineCount = tempText.lineCount

    var offHeight = tempText.naturalBounds.height - oriHeight
    if (panelBounds.height > oriHeight) {
      offHeight = offHeight - (panelBounds.height - oriHeight - ((panelBounds.height - oriHeight) % lineHeight))
    }

    if (offHeight < 0) return
    updatePartHeight(part, nodeData, offHeight, textBlock)
  }
}

// 获取 textBlock.panel 在文档坐标中的Rect
TextEditor.getPanelBounds = function(textBlock) {
  const mainElement = textBlock.panel.findMainElement()
  const data = TextEditor.nodeData
  let geometry = mainElement.geometry
  if (!geometry) {
    const figure = go.Shape.getFigureGenerators().get(mainElement.figure)
    geometry = typeof figure === 'function' ? figure(mainElement, mainElement.width, mainElement.height) : null
  }
  if (!geometry) return textBlock.panel.getDocumentNaturalBounds()
  const bounds = textBlock.panel.getDocumentNaturalBounds()

  let offX = 0
  let offY = 0
  return new go.Rect(bounds.x + offX, bounds.y + offY, Math.max(0, bounds.width), Math.max(0, bounds.height))
}

// 更新Shape的高度
function updatePartHeight(part, nodeData, offHeight, textBlock) {
  if (!part) return

  var curHeight = nodeData.height + offHeight
  var updateTempData = false
  if (curHeight <= TextEditor.minHeight) {
    part.diagram.model.setDataProperty(nodeData, 'height', TextEditor.minHeight)
    updateTempData = true
  } else if (curHeight > TextEditor.minHeight) {
    part.diagram.model.setDataProperty(nodeData, 'height', curHeight)
    updateTempData = true
  }

  // if (updateTempData) {
  //   TextEditor.loc = textBlock.getDocumentPoint(go.Spot.Center)
  //   TextEditor.panelBounds = TextEditor.getPanelBounds(textBlock)
  // }
}

export default TextEditor
