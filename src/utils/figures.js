import * as go from 'gojs'
export default function defineFigureGenerator () {
  // BU_FC_CostChain
  go.Shape.defineFigureGenerator('BU_FC_CostChain', function (shape, w, h) {
    // 弧半径
    const radius = 4
    // 弧度圆角
    const corner = radius * 0.2
    // 左侧部分比例
    const leftRate = 0.9
    // 左侧宽度
    const leftWidth = Math.min(h * leftRate, w / 3)
    // 尾部头部凹进突出比例
    const bulgeRate = 0.28
    // V形宽度比例
    const chevronWidthRate = 0.18
    // V形高度比例
    const chevronHeightRate = 0.15
    // 凸出宽度
    const bulgeWidth = leftWidth * bulgeRate
    // V形宽度
    const chevronWidth = leftWidth * chevronWidthRate
    // V形高度
    const chevronHeight = h * chevronHeightRate
    // V形凸出宽度
    const chevronBulgeWidth = chevronWidth * bulgeRate * 1.5
    // 两个V形之间的space
    const chevronSpace = 0
    const chevronLeftOffset = leftWidth / 2 + bulgeWidth / 2 - chevronSpace - chevronBulgeWidth / 3
    const chevronRightOffset = leftWidth / 2 + bulgeWidth / 2 + chevronSpace - chevronBulgeWidth / 3

    const geo = new go.Geometry()
    const fig = new go.PathFigure(0, 0, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))

    fig.add(new go.PathSegment(go.PathSegment.Line, bulgeWidth, h / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())

    fig.add(new go.PathSegment(go.PathSegment.Move, chevronLeftOffset, h / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronLeftOffset - chevronBulgeWidth, h / 2 - chevronHeight))
    fig.add(
      new go.PathSegment(
        go.PathSegment.Line,
        chevronLeftOffset - chevronBulgeWidth - chevronWidth,
        h / 2 - chevronHeight,
      ),
    )
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronLeftOffset - chevronWidth, h / 2))
    fig.add(
      new go.PathSegment(
        go.PathSegment.Line,
        chevronLeftOffset - chevronBulgeWidth - chevronWidth,
        h / 2 + chevronHeight,
      ),
    )
    fig.add(
      new go.PathSegment(go.PathSegment.Line, chevronLeftOffset - chevronBulgeWidth, h / 2 + chevronHeight).close(),
    )

    fig.add(new go.PathSegment(go.PathSegment.Move, chevronRightOffset, h / 2 - chevronHeight))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronRightOffset + chevronBulgeWidth, h / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronRightOffset, h / 2 + chevronHeight))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronRightOffset + chevronWidth, h / 2 + chevronHeight))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronRightOffset + chevronWidth + chevronBulgeWidth, h / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, chevronRightOffset + chevronWidth, h / 2 - chevronHeight).close())

    const fig2 = new go.PathFigure(leftWidth, 0, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, w - bulgeWidth, 0))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, h / 2))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w - bulgeWidth, h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h).close())

    geo.leftWidth = leftWidth
    // geo.spot1 = new go.Spot(0.33, 0.03)
    // geo.spot2 = new go.Spot(0.9, 0.9)
    return geo
  })
  // BU_FC_BusinessArea
  go.Shape.defineFigureGenerator('B_BusinessArea', function (shape, w, h) {
    // 弧半径
    const radius = 8
    // 弧度圆角
    const corner = radius * 0.2
    // 底侧部分比例
    const bottomRate = 0.22
    // 底侧高度Flow
    const bottomHeight = Math.max(h * bottomRate, 12)

    const geo = new go.Geometry()
    const fig = new go.PathFigure(radius, 0, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, w - radius, 0))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius, w - corner, 0, w, corner))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h - bottomHeight))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h - bottomHeight))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, radius, 0, 0, corner, corner, 0).close())

    const fig2 = new go.PathFigure(0, h - bottomHeight, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, h - bottomHeight))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, h - radius))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, w - radius, h, w, h - corner, w - corner, h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, radius, h))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - radius, corner, h, 0, h - corner))
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0, h - bottomHeight))

    geo.spot1 = new go.Spot(0.03, 0.03)
    geo.spot2 = new go.Spot(0.23, 0.23)
    return geo
  })
  // B-Flow
  go.Shape.defineFigureGenerator('B-Flow', function (shape, w, h) {
    // console.log('shape', shape && shape.parameter1)
    // 弧半径
    const radius = 8
    // 弧度圆角
    const corner = radius * 0.2
    // 左侧部分比例
    const leftRate = 0.9
    // 三角形宽度比例
    const triangleWidthRate = 0.3
    // 三角形高度比例
    const triangleHeightRate = 0.4
    // 左侧宽度
    const leftWidth = Math.min(h * leftRate, w / 3)
    // 三角形宽度
    const triangWidth = leftWidth * triangleWidthRate
    // 三角形高度
    const triangHeight = h * triangleHeightRate

    const geo = new go.Geometry()
    const fig = new go.PathFigure(radius, 0, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, radius, h))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - radius, corner, h, 0, h - corner))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, radius, 0, 0, corner, corner, 0))
    fig.add(new go.PathSegment(go.PathSegment.Move, (leftWidth - triangWidth) / 2, (h - triangHeight) / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, (leftWidth - triangWidth) / 2, (h + triangHeight) / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, (leftWidth + triangWidth) / 2, h / 2).close())

    const fig2 = new go.PathFigure(leftWidth, 0, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, w - radius, 0))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, radius, w - corner, 0, w, corner))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, h - radius))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, w - radius, h, w, h - corner, w - corner, h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h))

    geo.leftWidth = leftWidth
    // geo.spot1 = new go.Spot(0.1, 0.1)
    // geo.spot2 = new go.Spot(0.5, 0.85)
    return geo
  })
  // B-FlowGroup
  go.Shape.defineFigureGenerator('B-FlowGroup', function (shape, w, h) {
    // 弧半径
    const radius = 8
    // 弧度圆角
    const corner = radius * 0.2
    // 左侧部分比例
    const leftRate = 0.33
    // 三角形宽度比例
    const triangleWidthRate = 0.3
    // 三角形高度比例
    const triangleHeightRate = 0.4
    // 两个三角形之间的space比例
    const spaceRate = 0.0
    // 左侧宽度
    const leftWidth = w * leftRate
    // 三角形宽度
    const triangWidth = leftWidth * triangleWidthRate
    // 三角形高度
    const triangHeight = h * triangleHeightRate
    // 两个三角形之间的space
    const triangSpace = Math.min(leftWidth, h) * spaceRate

    const geo = new go.Geometry()
    const fig = new go.PathFigure(radius, 0, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, radius, h))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - radius, corner, h, 0, h - corner))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, radius, 0, 0, corner, corner, 0))
    fig.add(
      new go.PathSegment(go.PathSegment.Move, (leftWidth - triangSpace) / 2 - triangWidth, (h - triangHeight) / 2),
    )
    fig.add(
      new go.PathSegment(go.PathSegment.Line, (leftWidth - triangSpace) / 2 - triangWidth, (h + triangHeight) / 2),
    )
    fig.add(new go.PathSegment(go.PathSegment.Line, (leftWidth - triangSpace) / 2, h / 2).close())
    fig.add(new go.PathSegment(go.PathSegment.Move, (leftWidth + triangSpace) / 2, (h - triangHeight) / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, (leftWidth + triangSpace) / 2, (h + triangHeight) / 2))
    fig.add(new go.PathSegment(go.PathSegment.Line, (leftWidth + triangSpace) / 2 + triangWidth, h / 2).close())

    const fig2 = new go.PathFigure(leftWidth, 0, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, w - radius, 0))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, radius, w - corner, 0, w, corner))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, h - radius))
    fig2.add(new go.PathSegment(go.PathSegment.Bezier, w - radius, h, w, h - corner, w - corner, h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, leftWidth, h))

    geo.spot1 = new go.Spot(0.1, 0.1)
    // geo.spot2 = new go.Spot(0.5, 0.85)
    return geo
  })
  // B-RoundedRectangle
  go.Shape.defineFigureGenerator('B-RoundedRectangle', function (shape, w, h) {
    // 弧半径
    const radius = 8
    // 弧度圆角
    const corner = radius * 0.2
    const geo = new go.Geometry()
    const fig = new go.PathFigure(radius, 0, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, w - radius, 0))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius, w - corner, 0, w, corner))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h - radius))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w - radius, h, w, h - corner, w - corner, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, radius, h))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - radius, corner, h, 0, h - corner))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, radius, 0, 0, corner, corner, 0).close())

    geo.spot1 = new go.Spot(0.1, 0.1)
    // geo.spot2 = new go.Spot(0.5, 0.85)
    return geo
  })
  // G-RoundedRectangle
  go.Shape.defineFigureGenerator('G-RoundedRectangle', function (shape, w, h) {
    // predefined in 2.0
    const KAPPA = ((Math.sqrt(2) - 1) / 3) * 4
    const param1 = 8

    const cpOffset = param1 * KAPPA
    const geo = new go.Geometry().add(
      new go.PathFigure(param1, 0, true)
        .add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
        .add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset))
        .add(new go.PathSegment(go.PathSegment.Line, w, h - param1))
        .add(new go.PathSegment(go.PathSegment.Bezier, w - param1, h, w, h - cpOffset, w - cpOffset, h))
        .add(new go.PathSegment(go.PathSegment.Line, param1, h))
        .add(new go.PathSegment(go.PathSegment.Bezier, 0, h - param1, cpOffset, h, 0, h - cpOffset))
        .add(new go.PathSegment(go.PathSegment.Line, 0, param1))
        .add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close()),
    )
    // if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0.6, 0.5, cpOffset, cpOffset)
    geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset)
    // }
    return geo
  })

  // RectangleLackBottom
  go.Shape.defineFigureGenerator('RectangleLackBottom', function (shape, w, h) {
    const hLonger = h + 1
    const geo = new go.Geometry()
    const fig = new go.PathFigure(0, hLonger, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, hLonger))
    return geo
  })
  // DoubleCircular
  go.Shape.defineFigureGenerator('DoubleCircular', function (shape, w, h) {
    const geo = new go.Geometry()
    const fig = new go.PathFigure(w / 2, 0, true)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 360, w / 2, h / 2, w / 2, h / 2))
    const param = 0.05
    const offset = param * Math.max(w, h)
    const fig2 = new go.PathFigure(w / 2, offset, true)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Arc, 270, 360, w / 2, h / 2, w / 2 - offset, h / 2 - offset))

    geo.spot1 = new go.Spot(0.226, 0)
    geo.spot2 = new go.Spot(0.81, 1)
    return geo
  })
  // Process
  go.Shape.defineFigureGenerator('Process', function (shape, w, h) {
    const geo = new go.Geometry()
    let param1 = shape ? shape.parameter1 : NaN
    if (isNaN(param1)) param1 = 0.1 // Distance of left  line from left edge
    const fig = new go.PathFigure(0, 0, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
    const fig2 = new go.PathFigure(param1 * w, 0, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
    geo.spot1 = new go.Spot(0, 0, param1 * w)
    geo.spot2 = go.Spot.BottomRight
    return geo
  })
  // DataStorage
  go.Shape.defineFigureGenerator('DataStorage', function (shape, w, h) {
    const geo = new go.Geometry()
    const fig = new go.PathFigure(0, 0, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, h, 1.2 * w, 0.1 * h, 1.2 * w, 0.9 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.25 * w, 0.9 * h, 0.25 * w, 0.1 * h).close())
    geo.spot1 = new go.Spot(0.226, 0)
    geo.spot2 = new go.Spot(0.81, 1)
    return geo
  })

  // Cube1
  go.Shape.defineFigureGenerator('Cube1', function (shape, w, h) {
    const geo = new go.Geometry()
    const fig = new go.PathFigure(0.5 * w, h, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.85 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.15 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.85 * h).close())
    const fig2 = new go.PathFigure(0.5 * w, h, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.3 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.15 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.3 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
    geo.spot1 = new go.Spot(0, 0.3)
    geo.spot2 = new go.Spot(0.5, 0.85)
    return geo
  })
  // Cuboid
  go.Shape.defineFigureGenerator('Cuboid', function (shape, w, h) {
    const geo = new go.Geometry()
    const fig = new go.PathFigure(0.2 * w, 0, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h).close())
    const fig2 = new go.PathFigure(0.8 * w, h, false)
    geo.add(fig2)
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Move, 0.8 * w, 0.2 * h))
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0))
    geo.spot1 = new go.Spot(0, 0.3)
    geo.spot2 = new go.Spot(0.5, 0.85)
    return geo
  })
  // Pie
  go.Shape.defineFigureGenerator('Pie', function (shape, w, h) {
    const geo = new go.Geometry()
    let param1 = shape ? shape.parameter1 : NaN
    let param2 = shape ? shape.parameter2 : NaN
    if (isNaN(param1)) param1 = 0 // default values PARAMETER 1 is for Start Angle
    if (isNaN(param2)) param2 = 315 // default values PARAMETER 2 is for Sweep Angle

    let start = param1 % 360
    if (start < 0) start += 360
    const sweep = param2 % 360
    const rad = Math.min(w, h) / 2

    const fig = new go.PathFigure(rad, rad, true)
    geo.add(fig)
    fig.add(
      new go.PathSegment(
        go.PathSegment.Arc,
        start,
        sweep, // angles
        rad,
        rad, // center
        rad,
        rad,
      ).close(),
    )
    return geo
  })
  // YinYang
  go.Shape.defineFigureGenerator('YinYang', function (shape, w, h) {
    const geo = new go.Geometry()
    let fig = new go.PathFigure(w * 0.5, 0, true)
    geo.add(fig)
    // Right semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5))
    // bottom semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25))
    // top semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, w * 0.5, w * 0.25, w * 0.25, w * 0.25))
    const radius = 0.1 // of the small circles
    const centerx = 0.5
    let centery = 0.25
    // Top small circle, goes counter-clockwise
    fig.add(new go.PathSegment(go.PathSegment.Move, (centerx + radius) * w, centery * h))
    fig.add(new go.PathSegment(go.PathSegment.Arc, 0, -360, w * centerx, h * centery, radius * w, radius * w).close()) // Right semi-circle
    // Left semi-circle
    fig = new go.PathFigure(w * 0.5, 0, false)
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, -180, w * 0.5, w * 0.5, w * 0.5, w * 0.5))
    centery = 0.75
    // Bottom small circle
    fig = new go.PathFigure((centerx + radius) * w, centery * h, true) // Not a subpath
    geo.add(fig)
    fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, w * centerx, h * centery, radius * w, radius * w).close()) // Right semi-circle
    geo.defaultStretch = go.GraphObject.Uniform
    return geo
  })
  // Arch
  go.Shape.defineFigureGenerator('Arch', function (shape, w, h) {
    const geo = new go.Geometry()
    const fig = new go.PathFigure(w * 0.5, 0, true)
    geo.add(fig)
    // Right semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5))
    // bottom semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25))
    // top semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.25, w * 0.25, w * 0.25))
    return geo
  })
}

// RoundRectangleLackTop
go.Shape.defineFigureGenerator('RoundRectangleLackTop', function (shape, w, h) {
  // 弧半径
  const radius = 8
  // 弧度圆角
  const corner = radius * 0.2
  const geo = new go.Geometry()
  const fig = new go.PathFigure(w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, h - radius))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w - radius, h, w, h - corner, w - corner, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, radius, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - radius, corner, h, 0, h - corner))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  geo.spot1 = new go.Spot(0.03, 0.03)
  geo.spot2 = new go.Spot(0.97, 0.97)
  return geo
})
// RoundRectangleLackBottom
go.Shape.defineFigureGenerator('RoundRectangleLackBottom', function (shape, w, h) {
  // 弧半径
  const radius = 8
  // 弧度圆角
  const corner = radius * 0.2
  const geo = new go.Geometry()
  const fig = new go.PathFigure(0, h, true)
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius, 0, 0, corner, corner, 0))

  fig.add(new go.PathSegment(go.PathSegment.Line, w - radius, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius, w - corner, 0, w, corner))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))

  // fig.add(new go.PathSegment(go.PathSegment.Move, 0, h))
  // fig.add(new go.PathSegment(go.PathSegment.Line, 0, radius))
  // fig.add(
  //   new go.PathSegment(
  //     go.PathSegment.Bezier,
  //     radius,
  //     0,
  //     0,
  //     corner,
  //     corner,
  //     0
  //   ).close()
  // )
  geo.spot1 = new go.Spot(0.03, 0.03)
  geo.spot2 = new go.Spot(0.97, 0.97)
  return geo
})
