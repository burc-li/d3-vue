import * as go from 'gojs'

// 将margin字符串转换成一个Margin对象
export const marginParse = function (marginStr) {
  const defaultMargin = new go.Margin(0, 0, 0, 0)
  if (typeof marginStr !== 'string') return defaultMargin

  const [top = 0, right = 0, bottom = 0, left = 0] = marginStr.split(',').map(Number)
  return new go.Margin(top, right, bottom, left)
}

// 获取随机数
export const getRandom = function (n = 10, offset = 0) {
  return Math.ceil(Math.random() * n) + offset
}

// 获取parts的bounds
export function getPartsBounds (coll, includeLinks, strokeSpot) {
  if (includeLinks === undefined) includeLinks = false
  const tempBounds = new go.Rect()
  let b = null
  const defaultStrokeSpot = new go.Spot(0.5, 0.5)
  if (Array.isArray(coll)) {
    for (let i = 0; i < coll.length; i++) {
      const part = coll[i]
      if (!includeLinks && part instanceof go.Link) continue
      part.ensureBounds()
      getPartBounds(part, strokeSpot || defaultStrokeSpot, tempBounds)
      if (b === null) {
        b = tempBounds.copy()
      } else {
        b.unionRect(tempBounds.copy())
      }
    }
  } else {
    const it = coll.iterator
    while (it.next()) {
      const part = it.value
      if (!includeLinks && part instanceof go.Link) continue
      part.ensureBounds()
      getPartBounds(part, strokeSpot || defaultStrokeSpot, tempBounds)
      if (b === null) {
        b = tempBounds.copy()
      } else {
        b.unionRect(tempBounds)
      }
    }
  }
  if (b === null) return new go.Rect(NaN, NaN, 0, 0)
  return b
}

// 获取单个part的bounds
const getPartBounds = function (part, strokeSpot, result) {
  if (!result) result = new go.Rect()
  const object = part.resizeObject
  const angle = object.getDocumentAngle()
  const pt = object.getDocumentPoint(go.Spot.Center)
  const bounds = object.actualBounds
  const rad = (angle * Math.PI) / 180
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const width = Math.abs(bounds.width * cos) + Math.abs(bounds.height * sin)
  const height = Math.abs(bounds.width * sin) + Math.abs(bounds.height * cos)
  result.setTo(pt.x - width * 0.5, pt.y - height * 0.5, width, height)
  const strokeWidth = typeof object.strokeWidth === 'number' ? object.strokeWidth : 0
  if (part instanceof go.Link) {
    result.setTo(
      (result.x + strokeWidth * strokeSpot.x) | 0,
      (result.y + strokeWidth * strokeSpot.y) | 0,
      width,
      height,
    )
  } else {
    ensureTempBounds(result, angle, strokeWidth, strokeSpot)
  }
  return result
}

const ensureTempBounds = function (actualBounds, angle, strokeWidth, strokeSpot) {
  angle = angle % 90
  strokeWidth = typeof strokeWidth === 'number' ? strokeWidth : 0
  if (angle > 0) {
    strokeWidth = Math.round(strokeWidth / Math.sin((Math.PI * Math.max(90 - angle, angle)) / 180))
  }
  actualBounds.setTo(
    actualBounds.x + strokeWidth * strokeSpot.x,
    actualBounds.y + strokeWidth * strokeSpot.y,
    actualBounds.width - strokeWidth * strokeSpot.x * 2,
    actualBounds.height - strokeWidth * strokeSpot.y * 2,
  )
  return actualBounds
}

// 更新组合
export function updateAroundGroup (diagram, group, selectAfterUpdate = true) {
  if (group && group.data && group.data.isGroup) {
    const oldskips = diagram.skipsUndoManager
    diagram.skipsUndoManager = true
    diagram.startTransaction()
    const groupArr = findAllGroup([group])
    const selection = getAroundGroupSelection(diagram, groupArr)
    const unGroupSelection = selection.filter(part => {
      return part.data.category !== 'around-group'
    })
    if (unGroupSelection.length <= 1) {
      clearTargetAroundGroup(diagram, group)
      selectAfterUpdate && diagram.selectCollection(unGroupSelection)
    } else if (selection.length > 0) {
      const nodeColl = selection.filter(node => {
        return node instanceof go.Node && node.category !== 'around-group'
      })
      const linkColl = selection.filter(node => {
        return node instanceof go.Link
      })
      const partsBounds = getCollBounds(nodeColl, linkColl)
      if (partsBounds) {
        group.data.width = partsBounds.width
        group.data.height = partsBounds.height
        group.data.angle = 0
        group.data.loc = `${partsBounds.x + partsBounds.width / 2} ${partsBounds.y + partsBounds.height / 2}`
        group.updateTargetBindings()
      }
      if (selectAfterUpdate) {
        selection.forEach(node => {
          !node.isSelected && (node.isSelected = true)
        })
      }
    }
    diagram.rollbackTransaction()
    diagram.commitTransaction()
    diagram.skipsUndoManager = oldskips
  }
}

export function getAroundGroupSelection (diagram, coll) {
  let selection = []
  let hasAroundGroup = false
  coll.forEach(part => {
    if (part && part.data && part instanceof go.Group) {
      hasAroundGroup = true
    }
  })
  // 存在around-group时，需要全选
  if (hasAroundGroup) {
    coll.forEach(item => {
      if (item instanceof go.Group) {
        const key = item.data.key
        selection.push(item)
        diagram.nodes.each(node => {
          if (node.data && node.data.group === key) {
            selection.push(node)
          }
        })
        diagram.links.each(link => {
          if (link.data && link.data.group === key) {
            selection.push(link)
          }
        })
      } else {
        selection.push(item)
      }
    })
  } else {
    // 不存在around-group只选中顶层元素
    selection = coll
  }
  return selection
}

// 寻找一个分组之下所有的分组
export function findAllGroup (groupArr) {
  let groupCollection = []
  let cacheGroupCollection = []
  groupCollection = groupArr
  cacheGroupCollection = groupArr
  while (cacheGroupCollection.length > 0) {
    const thisLayerGroups = []
    cacheGroupCollection.forEach(group => {
      if (group) {
        group.memberParts.each(part => {
          if (part instanceof go.Group) {
            thisLayerGroups.push(part)
          }
        })
      }
    })
    groupCollection = groupCollection.concat(thisLayerGroups)
    cacheGroupCollection = thisLayerGroups
  }
  return groupCollection
}
// 清除组合
export function clearTargetAroundGroup (diagram, group) {
  const memberParts = toolFilterHandle.filterCellsInFirstGroup(diagram, group)
  memberParts.forEach(part => {
    if (part.data) {
      delete part.data.group
      if (part instanceof go.Node) {
        part.updateRelationshipsFromData()
      }
      part.data.tempAroundPart && diagram.model.setDataProperty(part.data, 'tempAroundPart', false)
      part.data.aroundPart && diagram.model.setDataProperty(part.data, 'aroundPart', false)
    }
  })
  return memberParts
}
