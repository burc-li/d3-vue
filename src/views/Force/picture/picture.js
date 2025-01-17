import * as d3 from 'd3'
import StartImg from '../img/start.svg'
import './picture.less'

const padding = { top: 200, left: 200 }

const conf = {
  r: 30,
  textColor: '#555',
  lineTextColor: '#555',
  lineColor: '#555',
  strokeActiveColor: 'rgb(51, 161, 255)',
  lineTextHide: false,
  pad: document.getElementsByTagName('body')[0],
  width: 0,
  height: 0,
  levelWidth: 200,
  levelHeigh: 200,
  clickNode: d => {},
  clickLink: d => {},
  cancelClick: () => {},
}

/** 生成力学图组件
 *  @param {Object|dom} pad - 放置svg的容器(默认为body)
 *  @param {Number} width - 画布宽度(不设置的话为容器的宽度)
 *  @param {Number} height - 画布高度(不设置的话为容器的高度)
 *  @param {Number} startId - 起点的节点id (设置的话将会出现起点标识)
 *  @param {Number} startClassId - 起点的分类id(设置的话将会出现起点标识)
 *  @param {Number} targetId - 终点的节点id(设置的话将会出现终点标识)
 *  @param {Number} targetClassId - 终点的分类id(设置的话将会出现终点标识)
 *  @param {String} textColor -字体的颜色
 *  @param {String} lineColor - 线条的颜色
 *  @param {String} strokeActiveColor -被激活的边框颜色
 *  @param {Boolean} lineTextHide -是否隐藏线上文字,默认是true
 *  @param {Number} levelWidth -分层时候的节点水平间距
 *  @param {Number} levelHeigh -分层时候的节点垂直间距
 *  @param {Function} clickNode - 节点点击的时候触发的函数
 *  @param {Function} clickLink - 关系线点击的时候触发的函数
 */
class ForceLayout {
  constructor ({
    pad = conf.pad,
    r = conf.r,
    width,
    height,
    textColor = conf.textColor,
    lineColor = conf.lineColor,
    lineTextColor = conf.lineTextColor,
    strokeActiveColor = conf.strokeActiveColor,
    lineTextHide = conf.lineTextHide,
    levelWidth = conf.levelWidth,
    levelHeigh = conf.levelHeigh,
    clickNode = conf.clickNode,
    clickLink = conf.clickLink,
    cancelClick = conf.cancelClick,
  }) {
    this.pad = d3
      .select(pad)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    this.r = r
    this.width = width || parseInt(this.pad.style('width'), 10)
    this.height = height || parseInt(this.pad.style('height'), 10)
    this.textColor = textColor
    this.lineColor = lineColor
    this.lineTextColor = lineTextColor
    this.strokeActiveColor = strokeActiveColor
    this.lineTextHide = lineTextHide
    this.levelWidth = levelWidth
    this.levelHeigh = levelHeigh
    this.normalArrow = this.appendArrowNormal(lineColor)
    this.clickNode = clickNode
    this.clickLink = clickLink
    this.cancelClick = cancelClick
    // 点击事件
    this.pad.on('click', this.clickEmpty.bind(this))
    document.oncontextmenu = () => false
  }

  // 改变起点或者终点
  changeTipType ({ sourceId, targetId, sourceClassId, targetClassId }) {
    this.sourceId = sourceId
    this.sourceClassId = sourceClassId
    this.targetId = targetId
    this.targetClassId = targetClassId
  }

  // 开始画图
  start (node, line, ciClassInfos) {
    this.createGraph()
    this.nodes = node
    this.lines = line
    this.ciClassInfos = ciClassInfos
    console.log('lines', this.lines)
    // 分层的节点
    this.levleMap = null
    this.forceLineCreate(line)
    this.forceNodeCreate(node, line)
  }

  createGraph () {
    const _t = this
    if (_t.graph) {
      _t.graph.remove()
    }
    _t.graph = _t.pad.append('g').classed('graph', true)

    // https://d3js.org.cn/document/d3-zoom/#api-reference
    _t.zoom = d3
      .zoom()
      .on('zoom', () => {
        _t.graph.attr('transform', d3.event.transform)
      })
      .filter(() => {
        return d3.event.which === 3 || d3.event.which === 0
      })

    _t.changeZoom()
  }

  // 箭头方法 - https://d3js.org.cn/svg/get_start/#_2-marker%E5%85%83%E7%B4%A0 - https://www.zhangxinxu.com/wordpress/2014/08/svg-viewport-viewbox-preserveaspectratio/
  appendArrowNormal (c) {
    const _t = this
    const arrow = _t.pad
      .append('marker')
      .attr('id', 'arrow_noraml')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('viewBox', '0 0 12 12')
      .attr('refX', 0)
      .attr('refY', 6)
      .attr('orient', 'auto')

    const path = 'M0,0 L0,12 L8,6'
    arrow
      .append('path')
      .attr('d', path)
      .attr('fill', c)

    return 'arrow_noraml'
  }

  // 力学图线DOM
  forceLineCreate (lines) {
    const _t = this
    const ele = _t.graph
      .selectAll('g.lineG')
      .data(lines)
      .enter()
      .append('g')
      .classed('lineG', true)
      .attr('id', d => `L_${d.id}`)
      .style('cursor', 'pointer')
      .on('click', function (d) {
        _t.clickLink(d)
        _t.linkChooice(this)
      })
      .on('mouseenter', d => {
        _t.displayShowByLink(d)
      })
      .on('mouseleave', () => {
        _t.displayHide()
      })

    ele
      .append('path')
      .classed('bd-path-chooice', true)
      .attr('stroke', _t.strokeActiveColor)
      .attr('fill', '#e3f2ff')
      .attr('stroke-dasharray', '4, 3.7')
      .attr('opacity', 0)

    ele
      .append('text')
      .classed('line_text', true)
      .text(d => 'libc')
      .style('text-anchor', 'middle')
      .style('cursor', 'pointer')
      .attr('fill', `${_t.lineTextHide ? 'none' : _t.lineTextColor}`)

    ele
      .append('path')
      .classed('force_line', true)
      .attr('stroke', _t.lineColor)
      .attr('marker-end', `url(#${_t.normalArrow})`)
      .attr('fill', 'none')
  }

  // 创建力学图模型
  forceNodeCreate (node, line) {
    const _t = this

    // 创建节点线之间的力矩
    const lineSetting = d3
      // 弹簧模型,将有关联的两个节点拉近或者推远。力的强度与被链接两个节点的距离成比例，类似弹簧力
      .forceLink(line)
      // id访问器
      .id(d => d.id)
      // 距离访问器
      .distance(100)
      // 强度访问器
      .strength(0.01)

    // 创建一个电荷力模型
    const chargeSetting = d3
      .forceManyBody()
      // 强度访问器，强度为正值则表示节点之间相互吸引，负值表示节点之间相互排斥
      .strength(-40)
      // 节点之间的最大距离
      .distanceMax(_t.height / 2)

    // 使用指定的 x- 和 y- 坐标创建一个新的向心力模型，图的中心点
    const centerSetting = d3.forceCenter(_t.width / 2, _t.height / 2)

    // 创建力模型
    _t.force = d3
      .forceSimulation(node)
      // 弹簧力
      .force('link', lineSetting)
      // 电荷力
      .force('charge', chargeSetting)
      // 向心力
      .force('center', centerSetting)

    // 速度衰减
    _t.force
      .alpha(1)
      .alphaTarget(1)
      // 速度衰减系数，衰减系数类似于阻力
      .velocityDecay(0.1)
    _t.drawNodes(node)
    _t.force.on('tick', () => _t.upDateNodeAndLine())
  }

  drawNodes (nodes) {
    const _t = this
    const dragEvent = _t.dragNodeEvent()
    const ele = _t.graph
      .selectAll('g.nodeG')
      .data(nodes)
      .enter()
      .append('g')
      .classed('nodeG', true)
      .attr('id', d => `N_${d.id}`)
      .style('cursor', 'pointer')
      .on('mouseenter', d => {
        _t.displayShowByNode(d)
      })
      .on('mouseleave', () => {
        _t.displayHide()
      })
    // 添加节点
    ele.each(function (d) {
      const e = d3.select(this)
      _t.drawNodesImgAndText(e, d)
    })
    ele.call(dragEvent)
  }

  // 拖拽移动事件
  dragNodeEvent () {
    const _t = this
    let left = 0
    let top = 0
    const dragEvent = d3
      .drag()
      .on('start', function (d) {
        d3.select(this).raise()
        d.fx = d.x
        d.fy = d.y
        left = d3.event.x
        top = d3.event.y
      })
      .on('drag', function (d) {
        d.x += d3.event.dx
        d.y += d3.event.dy
        d.fx += d3.event.dx
        d.fy += d3.event.dy
        d3.select(this).attr('transform', () => `translate(${d.fx}, ${d.fy})`)
        const sel = _t.filterLine(d.id)
        _t.updateLine(sel)
      })
      .on('end', function (d) {
        left = d3.event.x - left
        top = d3.event.y - top

        if (left === 0 && top === 0) {
          const obj = {}
          _t.ciClassInfos[d.classId].attrDefs.forEach(val => {
            obj[val.proName] = d.attrs[val.proStdName] || d.attrs[val.proName]
          })
          d.attrs = obj
          d.ciClass = _t.ciClassInfos[d.classId].ciClass
          _t.clickNode(d)
          _t.nodeChooice(this)
        }
      })
    return dragEvent
  }

  // 力学图节点DOM
  drawNodesImgAndText (ele, data) {
    const _t = this
    ele
      .append('rect')
      .classed('bd-rect-chooice', true)
      .attr('x', d => {
        d.r = _t.r
        d.w = -d.r * Math.sqrt(0.5)
        return d.w - 5
      })
      .attr('y', d => d.w - 5)
      .attr('height', d => -2 * d.w + 10)
      .attr('width', d => -2 * d.w + 10)
      .attr('fill', 'none')
      .attr('opacity', 0)
      .attr('stroke', _t.strokeActiveColor)
      .attr('stroke-dasharray', '4, 3.7')

    ele
      .append('image')
      .classed('background', true)
      .attr('width', d => -2 * d.w)
      .attr('height', d => -2 * d.w)
      .attr('transform', d => `translate(${d.w}, ${d.w})`)
      .attr('xlink:href', d => _t.ciClassInfos[d.classId].ciClass.icon)

    ele
      .append('text')
      .text(d => {
        let name
        if (d.ci.ciCode) {
          name = d.ci.ciCode
        }
        if (d.ci.ciPrimaryKey) {
          const ciPrimaryKey = JSON.parse(d.ci.ciPrimaryKey)
          if (ciPrimaryKey.length > 0 || (ciPrimaryKey.length === 1 && ciPrimaryKey[0] !== '')) {
            name = ciPrimaryKey.join(',')
          }
        }
        if (d.ci.ciLabel) {
          const ciLabel = JSON.parse(d.ci.ciLabel)
          if (ciLabel.length > 0 || (ciLabel.length === 1 && ciLabel[0] !== '')) {
            name = ciLabel.join(',')
          }
        }
        return name
      })
      .style('text-anchor', 'middle')
      .attr('y', d => -2 * d.w)
      .attr('fill', _t.textColor)

    _t.drawSourceOrTargetTip(ele, data)
  }

  // 绘制起点或者终点标志
  drawSourceOrTargetTip (ele, data) {
    const _t = this
    if (_t.sourceId && String(data.id) === String(_t.sourceId)) {
      ele
        .append('image')
        .classed('background', true)
        .attr('width', 30)
        .attr('height', 30)
        .attr('transform', () => `translate(${(data.w - 10) / 2}, ${data.w - 30})`)
        .attr('xlink:href', StartImg)
    }
  }

  filterLine (id) {
    const _t = this
    const line = _t.graph.selectAll('.lineG').filter(d => d.target.id === id || d.source.id === id)
    return line
  }

  // 更新节点和线的位置
  upDateNodeAndLine () {
    const _t = this
    _t.updateNode()
    _t.updateLine()
  }

  updateLine (sel) {
    const _t = this
    if (!sel) {
      sel = _t.graph.selectAll('g.lineG')
    }

    sel.select('path.force_line').attr('d', d => {
      const dx = d.target.x - d.source.x
      const dy = d.target.y - d.source.y
      const dr = Math.sqrt(dx * dx + dy * dy)
      return `M
      ${d.source.x + (d.source.r * dx) / dr}
      ${d.source.y + (d.source.r * dy) / dr}
      L
      ${d.target.x - ((d.target.r + 4) * dx) / dr}
      ${d.target.y - ((d.target.r + 4) * dy) / dr}`
    })
    sel.select('path.bd-path-chooice').attr('d', d => {
      const dx = d.target.x - d.source.x
      const dy = d.target.y - d.source.y
      const dr = Math.sqrt(dx * dx + dy * dy)
      const sourceX = d.source.x + ((d.source.r - 4) * dx) / dr
      const sourceY = d.source.y + ((d.source.r - 4) * dy) / dr
      const targetX = d.target.x - (d.target.r * dx) / dr
      const targetY = d.target.y - (d.target.r * dy) / dr
      return `
      M
      ${sourceX + (4 * dy) / dr} 
      ${sourceY - (4 * dx) / dr}
      L 
      ${targetX + (4 * dy) / dr} 
      ${targetY - (4 * dx) / dr}
      L 
      ${targetX - (4 * dy) / dr} 
      ${targetY + (4 * dx) / dr}
      L 
      ${sourceX - (4 * dy) / dr} 
      ${sourceY + (4 * dx) / dr}
      L 
      ${sourceX + (4 * dy) / dr} 
      ${sourceY - (4 * dx) / dr}`
    })
    sel.select('text').attr('transform', d => {
      const dx = (d.target.x + d.source.x) / 2
      const dy = (d.target.y + d.source.y) / 2
      return `translate(${dx}, ${dy})`
    })
  }

  updateNode () {
    const _t = this
    _t.graph.selectAll('.nodeG').attr('transform', d => `translate(${d.x}, ${d.y})`)
  }

  clickEmpty () {
    if (d3.event.target.nodeName === 'svg') {
      this.nodeChooice()
      this.linkChooice()
      this.cancelClick()
    }
  }

  // 添加点击节点的效果
  nodeChooice (g) {
    this.emptyActiveStatus()
    if (g) {
      const dom = d3.select(g)
      dom
        .select('.bd-rect-chooice')
        .attr('fill', '#e3f2ff')
        .attr('opacity', 1)
    }
  }

  // 添加点击线的效果
  linkChooice (g) {
    const _t = this
    _t.emptyActiveStatus()
    if (g) {
      const dom = d3.select(g)
      dom
        .select('path.bd-path-chooice')
        .attr('fill', '#e3f2ff')
        .attr('opacity', 1)
    }
  }

  // 清空线、节点的选中效果
  emptyActiveStatus () {
    const _t = this
    _t.pad
      .selectAll('.bd-rect-chooice')
      .attr('fill', '#fff')
      .attr('opacity', 0)
    _t.pad
      .selectAll('path.bd-path-chooice')
      .attr('fill', '#fff')
      .attr('opacity', 0)
  }

  // 根据节点信息进行特效展示
  displayShowByNode (d) {
    const nodeMap = {}
    this.graph.selectAll('.lineG').classed('opacity', true)
    const lines = this.graph.selectAll('.lineG').filter(l => {
      if (l.source.id === d.id) {
        nodeMap[l.target.id] = true
      } else if (l.target.id === d.id) {
        nodeMap[l.source.id] = true
      }
      return l.source.id === d.id || l.target.id === d.id
    })
    lines.classed('opacity', false)
    lines.selectAll('path.force_line').classed('show', true)
    this.graph.selectAll('.nodeG').classed('opacity', true)
    const nodes = this.graph.selectAll('.nodeG').filter(n => nodeMap[n.id] || n.id === d.id)
    nodes.classed('opacity', false)
  }

  // 根据关系信息进行特效展示
  displayShowByLink (d) {
    this.graph.selectAll('.lineG').classed('opacity', true)
    const lines = this.graph.selectAll('.lineG').filter(l => l.id === d.id)
    lines.classed('opacity', false)
    lines.selectAll('path.force_line').classed('show', true)
    this.graph.selectAll('.nodeG').classed('opacity', true)
    const nodes = this.graph.selectAll('.nodeG').filter(n => n.id === d.sourceCiId || n.id === d.targetCiId)
    nodes.classed('opacity', false)
  }

  // 隐藏全部特效
  displayHide () {
    this.graph.selectAll('.lineG').classed('opacity', false)
    this.graph.selectAll('.lineG path.force_line').classed('show', false)
    this.graph.selectAll('.nodeG').classed('opacity', false)
  }

  changeZoom (x = 0, y = 0, k = 1) {
    const _t = this
    const zoom = d3.zoomTransform(_t.pad)
    zoom.x = x
    zoom.y = y
    zoom.k = k
    _t.zoom.transform(_t.pad, zoom)
    _t.pad.call(_t.zoom)
  }

  // 通过ciId选中节点
  selectNodeByCiId (ciId) {
    const id = `N_${ciId}`
    const g = document.getElementById(id)
    const d = this.nodes.find(n => n.id === ciId)
    this.clickNode(d)
    this.nodeChooice(g)
  }

  // 通过rltId选中关系线
  selectLinkByRltId (rltId) {
    const id = `L_${rltId}`
    const g = document.getElementById(id)
    const d = this.lines.find(l => l.id === rltId)
    this.clickLink(d)
    this.linkChooice(g)
  }
}

export default ForceLayout
