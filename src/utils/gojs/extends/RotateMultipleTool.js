'use strict'
import go from 'gojs'
import { updateAroundGroup, getPartsBounds } from '@/utils/index.js'

export default function RotateMultipleTool () {
  go.RotatingTool.call(this)
  this.name = 'RotateMultiple'
  this.handleAngle = 225
  this.handleDistance = 10
  this.snapAngleEpsilon = 4
  this.initialInfo = null
  this.startingCenter = null
  this.startingAngle = 0
  this.padding = new go.Margin(8)
  this.startDocumentPoint = null
  this.handlePoint = null
  this.snapAngleMultiple = 90
}
go.Diagram.inherit(RotateMultipleTool, go.RotatingTool)
// diagram.toolManager.rotatingTool.handleDistance = 30

RotateMultipleTool.prototype.doActivate = function () {
  go.RotatingTool.prototype.doActivate.call(this)
  const diagram = this.diagram
  const baseRotateObject = this.handle.part.adornedPart.findObject('SHAPE') || this.handle.part.adornedPart
  const partNaturalBounds = baseRotateObject.naturalBounds
  const partActualBounds = baseRotateObject.getDocumentPoint(go.Spot.Center)
  this.startDocumentPoint = this.handle.part.location
  this.handlePoint = new go.Point(
    partActualBounds.x - partNaturalBounds.centerX - 10 / this.diagram.scale,
    partActualBounds.y - partNaturalBounds.centerY - 10 / this.diagram.scale,
  )
  if (diagram === null) return
  const validSelection = diagram.selection.filter(node => {
    return node && node.data && !node.data.lock
  })
  if (validSelection.count === 1) {
    this.startingCenter = baseRotateObject.getDocumentPoint(go.Spot.Center).copy()
  } else {
    this.startingCenter = diagram.computePartsBounds(validSelection).center
  }
  this.startingAngle = 0
  // compute the original size and position of the collection
  const b = diagram.computePartsBounds(validSelection)
  b.addMargin(this.padding)
  this.startingSize = b.size
  this.originalSize = b.size
  this.originalPos = b.position
  const infos = new go.Map()
  const tool = this
  validSelection.each(function (part) {
    tool.walkTree(part, infos)
  })
  this.initialInfo = infos
  this.showTip()
}
RotateMultipleTool.prototype.walkTree = function (part, infos) {
  if (part === null) return
  // saves relative position and size
  const loc = part.locationObject.getDocumentPoint(go.Spot.Center)
  const locoffset = loc.copy().subtract(part.location)
  const relloc = loc.subtract(this.startingCenter)
  const points = part.points && part.points.toArray()
  infos.add(part, new MultiplePartInfo(part.resizeObject.actualBounds.size, relloc, locoffset, part.angle, points))
  // // recurse into Groups
  // if (part instanceof go.Group) {
  //   var it = part.memberParts.iterator
  //   while (it.next()) this.walkTree(it.value, infos)
  // }
}
function MultiplePartInfo (size, relativeloc, locoffset, rotationAngle, points) {
  this.size = size
  this.relativeLocation = relativeloc
  this.centerLocationOffset = locoffset
  this.rotationAngle = rotationAngle // in degrees
  this.points = points
}
RotateMultipleTool.prototype.computeRotate = function (newPoint) {
  let a = this.startingCenter.directionPoint(newPoint)
  const b = this.startingCenter.directionPoint(this.startDocumentPoint)
  const startHandleAngle = this.startingCenter.directionPoint(this.handlePoint)
  const c = startHandleAngle % 90
  let d = a - c
  const interval = Math.min(Math.abs(this.snapAngleMultiple), 180)
  const epsilon = Math.min(Math.abs(this.snapAngleEpsilon), interval / 2)
  if (d >= 360) d -= 360
  else if (d < 0) d += 360
  // if it's close to a multiple of INTERVAL degrees, make it exactly so
  if ((this.diagram === null || !this.diagram.lastInput.shift) && interval > 0 && epsilon > 0) {
    if (d % interval < epsilon) {
      a = Math.floor(d / interval) * interval + c
    } else if (d % interval > interval - epsilon) {
      a = (Math.floor(d / interval) + 1) * interval + c
    }
  }
  let ang = Math.round(a - b)
  {
    // shift 按45度旋转
    const interval = 45
    // const epsilon = 22.5
    if (this.diagram.lastInput.shift) {
      // if (a % interval < epsilon) {
      a = Math.floor(a / interval) * interval
      // } else if (a % interval > interval - epsilon) {
      //   a = (Math.floor(a / interval) + 1) * interval
      // }
      const angleObj = this.initialInfo.get(this.handle.part.adornedPart)
      if (angleObj) {
        ang = a - angleObj.rotationAngle + 180
      }
    }
  }
  //  + this.handleAngle // for zero angle, the rotate handle is above Placeholder, not to the right
  if (ang >= 360) ang -= 360
  else if (ang < 0) ang += 360
  return ang
}
RotateMultipleTool.prototype.updateAdornments = function (part) {
  this.handleDistance = 10 / this.diagram.scale
  console.log('this.diagram.scale', this.diagram.scale)
  go.RotatingTool.prototype.updateAdornments.call(this, part)
}
RotateMultipleTool.prototype.updatePartAdornment = function (part, angle) {
  part.adornments.each(adornment => {
    adornment.angle = angle
  })
}
/**
 * Rotate all selected Parts about their collective center.
 * @this {ResizeRotateMultipleTool}
 * @param {number} newangle
 */
RotateMultipleTool.prototype.rotate = function (newangle) {
  const diagram = this.diagram
  if (diagram === null) return
  const cp = this.startingCenter
  const sz = this.startingSize
  const origsz = this.originalSize
  const fx = sz.width / origsz.width
  const fy = sz.height / origsz.height
  const newcntr = new go.Point(sz.width / 2, sz.height / 2)
  this.initialInfo.each(kvp => {
    const part = kvp.key
    const info = kvp.value
    if (part instanceof go.Link && info.points && info.points.length > 1) {
      const points = info.points
      if (!part.fromNode) {
        const point = points[0].copy()
        point
          .subtract(cp)
          .rotate(newangle)
          .add(cp)
        part.defaultFromPoint = point
      }
      if (!part.toNode) {
        const point = points[points.length - 1].copy()
        point
          .subtract(cp)
          .rotate(newangle)
          .add(cp)
        part.defaultToPoint = point
      }
      this.diagram.updateLinkPoints(part)
    } else {
      const targetAngle = info.rotationAngle + newangle
      part.angle = targetAngle
      const loc = new go.Point(
        fx * (info.relativeLocation.x + origsz.width / 2),
        fy * (info.relativeLocation.y + origsz.height / 2),
      )
      const dist = Math.sqrt(newcntr.distanceSquaredPoint(loc))
      const dir = newcntr.directionPoint(loc)
      const newrad = (newangle + dir) * (Math.PI / 180)
      const locoffset = info.centerLocationOffset.copy()
      locoffset.x *= fx
      locoffset.y *= fy
      locoffset.rotate(newangle)
      part.location = new go.Point(cp.x + dist * Math.cos(newrad), cp.y + dist * Math.sin(newrad)).subtract(locoffset)
    }
  })
}
RotateMultipleTool.prototype.doMouseUp = function () {
  // go.RotatingTool.prototype.doMouseUp.call(this)
  const diagram = this.diagram
  if (this.isActive) {
    diagram.delaysLayout = false
    diagram.invalidateDocumentBounds()
    this.transactionResult = this.name
    diagram.raiseDiagramEvent('PartRotated', this.adornedObject, this.originalAngle)
  }
  this.stopTool()
  this.initialInfo.each(kvp => {
    const part = kvp.key
    part.updateAdornments()
  })
}
RotateMultipleTool.prototype.doDeactivate = function () {
  const data = this.handle.part.adornedPart.data
  const node = this.handle.part.adornedPart
  if (node.memberParts) {
    node.memberParts.each(part => {
      if (part.data.category === 'around-group') {
        part.data.angle = 0
        part.angle = 0
        updateAroundGroup(this.diagram, part)
      }
    })
  }
  if (data.category === 'around-group') {
    data.angle = 0
    node.angle = 0
    updateAroundGroup(this.diagram, node)
  }
  go.RotatingTool.prototype.doDeactivate.call(this)
}
RotateMultipleTool.prototype.showTip = function () {
  if (this.diagram.currentTool.name !== 'Rotating') return
  const oldskips = this.diagram.skipsUndoManager
  this.diagram.skipsUndoManager = true
  const data = this.handle.part.adornedPart.data
  const node = this.handle.part.adornedPart
  const angle = data.angle || 0
  const partData = this.diagram.model.findNodeDataForKey('toolTipRotate')
  const x = Math.round(node.actualBounds.centerX)
  const bounds = getPartsBounds(new go.List().add(node))
  const tipHeight = 27.5
  const y = Math.floor(
    node.location.y +
      (1 - node.locationSpot.y) * bounds.height +
      Math.floor((1 - node.locationSpot.y) * (tipHeight / this.diagram.scale)) +
      5,
  )
  if (!partData) {
    this.diagram.isRotating = true
    const diagramPanelData = {
      category: 'toolTip',
      // 唯一的key值
      key: 'toolTipRotate',
      loc: x + ' ' + y,
      label: Math.round(angle) + '°',
    }
    if (this.diagram.findLayer('').opacity !== 1) {
      this.diagram.layers.each(layer => {
        if (~layer.name.indexOf('layer') && layer.opacity === 1) {
          diagramPanelData.layerName = layer.name
        }
      })
    }
    this.diagram.model.addNodeData(diagramPanelData)
  } else {
    this.diagram.model.setDataProperty(partData, 'loc', x + ' ' + y)
    let angleLabel
    if (angle > 180) {
      const tipAngle = 360 - Math.round(angle)
      angleLabel = `${Math.round(angle)}°(-${tipAngle}°)`
    } else {
      angleLabel = `${Math.round(angle)}°`
    }
    this.diagram.model.setDataProperty(partData, 'label', angleLabel)
  }
  this.diagram.skipsUndoManager = oldskips
}
RotateMultipleTool.prototype.doMouseMove = function () {
  go.RotatingTool.prototype.doMouseMove.call(this)
  this.showTip()
}
