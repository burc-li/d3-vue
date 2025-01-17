import * as go from 'gojs'
/**
 * @name 自定义网格布局
 * @param {Number} columns 列数
 * @param {Strign —> Point} offset 整体偏移量
 * @param {Strign -> Size} spacing 节点之间的距离
 */
export function MyGridLayout ({ columns = 3, offset = '10 10', spacing = '10 10' }) {
  go.CircularLayout.call(this)
  this._columns = columns
  this._offset = go.Point.parse(offset)
  this._spacing = go.Size.parse(spacing)
}
go.Diagram.inherit(MyGridLayout, go.Layout)
MyGridLayout.prototype.doLayout = function (coll) {
  // get the Nodes and Links to be laid out
  const it = this.collectParts(coll).iterator
  // Start the layout at the arrangement origin, a property inherited from Layout
  this.arrangementOrigin = this._offset
  let index = 0
  while (it.next()) {
    const node = it.value
    if (!(node instanceof go.Node)) continue // ignore Links
    const x = this.getGridX(index, node, coll)
    const y = this.getGridY(index, node, coll)
    node.move(new go.Point(x, y), true)
    index++
  }
}
// 获取网格布局节点的X轴值
MyGridLayout.prototype.getGridX = function (index, node, coll) {
  const maxWidth = this.getMaxWidth(coll)
  const currWidth = node.desiredSize.width
  const currCol = index % this._columns
  const x = this.arrangementOrigin.x + currCol * (maxWidth + this._spacing.width)
  const offset = maxWidth / 2
  return x + offset
}
// 获取网格布局节点的Y轴值
MyGridLayout.prototype.getGridY = function (index, node, coll) {
  const maxHeight = this.getMaxHeight(coll)
  const currHeight = node.desiredSize.height
  const currRow = Math.floor(index / this._columns)
  const y = this.arrangementOrigin.y + currRow * (maxHeight + this._spacing.height)
  const offset = maxHeight / 2
  return y + offset
}
// 获取node最大宽度
MyGridLayout.prototype.getMaxWidth = function (coll) {
  const widthList = coll._dataArray.map(item => {
    return item instanceof go.Node ? item.desiredSize.width : 0
  })
  return Math.max(...widthList)
}
// 获取node最大高度
MyGridLayout.prototype.getMaxHeight = function (coll) {
  const heightList = coll._dataArray.map(item => {
    return item instanceof go.Node ? item.desiredSize.height : 0
  })
  return Math.max(...heightList)
}

/**
 * @name 自定义圆形布局
 * @param {Number} radius 半径
 * @param {Strign —> Point} center 圆心
 * @param {Object} container 父容器
 */
export function MyCircularLayout ({ radius = 20, center = '0 0', offset = '0 0', container = null }) {
  go.CircularLayout.call(this)
  this._offset = go.Point.parse(offset)
  this._container = container
  this._radius = radius
  this._center = container ? this.getCenterXY() : go.Point.parse(center).add(new go.Point(-radius, -radius))
}
go.Diagram.inherit(MyCircularLayout, go.Layout)
MyCircularLayout.prototype.doLayout = function (coll, sec) {
  // get the Nodes and Links to be laid out
  const it = this.collectParts(coll).iterator
  // Start the layout at the arrangement origin, a property inherited from Layout
  // this.arrangementOrigin = new go.Point(0, 0)
  const count = this.nodeCount(coll)
  const baseAngle = 360 / count
  let index = 0
  while (it.next()) {
    const node = it.value
    if (!(node instanceof go.Node)) continue // ignore Links
    const x = this.getCircularX(index, baseAngle, node)
    const y = this.getCircularY(index, baseAngle, node)
    node.move(new go.Point(x, y), true)
    index++
  }
}
// 获取圆形布局原点坐标
MyCircularLayout.prototype.getCenterXY = function () {
  const layoutBox = this._container.findObject('layoutBox')
  return new go.Point(layoutBox.width / 2 - this._radius, layoutBox.height / 2 - this._radius)
}
// 获取圆形布局节点的X轴值
MyCircularLayout.prototype.getCircularX = function (index, baseAngle, node) {
  const widthSelf = node.desiredSize.width
  const angle = baseAngle * index
  const radian = (angle * 2 * Math.PI) / 360
  const x = this._radius + this._radius * Math.sin(radian) + this._center.x
  return x + this._offset.x
}
// 获取圆形布局节点的Y轴值
MyCircularLayout.prototype.getCircularY = function (index, baseAngle, node) {
  const heightSelf = node.desiredSize.height
  const angle = baseAngle * index
  const radian = (angle * 2 * Math.PI) / 360
  const y = this._radius - this._radius * Math.cos(radian) + this._center.y
  return y + this._offset.y
}
// 获取node数量
MyCircularLayout.prototype.nodeCount = function (coll) {
  const nodeList = coll._dataArray.filter(item => item instanceof go.Node)
  return nodeList.length
}
// 获取link数量
MyCircularLayout.prototype.linkCount = function (coll) {
  const linkList = coll._dataArray.filter(item => item instanceof go.Link)
  return linkList.length
}
