import go from 'gojs'
// 得到元素的自然坐标（其实就是文档坐标中的Rect：getDocumentBounds）
go.GraphObject.prototype.getDocumentNaturalBounds = function () {
  // 获取对象边界在文档坐标中的Rect
  const docunemtBounds = this.getDocumentBounds()
  // 获取对象边界在局部local坐标中的Rect
  const naturalBounds = this.naturalBounds
  return new go.Rect(
    docunemtBounds.centerX - naturalBounds.width / 2,
    docunemtBounds.centerY - naturalBounds.height / 2,
    naturalBounds.width,
    naturalBounds.height,
  )
}
