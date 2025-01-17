'use strict'
/*
 *  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
 */

/*
 * This is an extension and not part of the main GoJS library.
 * Note that the API for this class may change with any version, even point releases.
 * If you intend to use an extension in production, you should copy the code to your own source directory.
 * Extensions can be found in the GoJS kit under the extensions or extensionsTS folders.
 * See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
 */

/**
 * @constructor
 * @extends ResizingTool
 * @class
 * A custom tool for resizing multiple objects at once.
 */
export default function ResizeMultipleTool () {
  go.ResizingTool.call(this)
  this.name = 'ResizeMultiple'
}
go.Diagram.inherit(ResizeMultipleTool, go.ResizingTool)

/**
 * Overrides ResizingTool.resize to resize all selected objects to the same size.
 * @this {ResizeMultipleTool}
 * @param {Rect} newr the intended new rectangular bounds for each Part's {@link Part#resizeObject}.
 */
ResizeMultipleTool.prototype.resize = function (newr) {
  const diagram = this.diagram
  if (diagram === null) return
  diagram.selection.each(function (part) {
    if (part instanceof go.Link) return // only Nodes and simple Parts
    const obj = part.resizeObject

    // calculate new location
    const pos = part.position.copy()
    const angle = obj.getDocumentAngle()
    const sc = obj.getDocumentScale()

    const radAngle = (Math.PI * angle) / 180
    const angleCos = Math.cos(radAngle)
    const angleSin = Math.sin(radAngle)

    const deltaWidth = newr.width - obj.naturalBounds.width
    const deltaHeight = newr.height - obj.naturalBounds.height

    const angleRight = angle > 270 || angle < 90 ? 1 : 0
    const angleBottom = angle > 0 && angle < 180 ? 1 : 0
    const angleLeft = angle > 90 && angle < 270 ? 1 : 0
    const angleTop = angle > 180 && angle < 360 ? 1 : 0

    pos.x += sc * ((newr.x + deltaWidth * angleLeft) * angleCos - (newr.y + deltaHeight * angleBottom) * angleSin)
    pos.y += sc * ((newr.x + deltaWidth * angleTop) * angleSin + (newr.y + deltaHeight * angleLeft) * angleCos)

    obj.desiredSize = newr.size
    part.position = pos
  })
}
