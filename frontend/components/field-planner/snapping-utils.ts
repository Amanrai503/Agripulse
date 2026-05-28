export interface FieldShape {
  id: string;
  type: 'rect' | 'circle' | 'polygon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  cropType: string;
  color: string;
  points?: number[]; // For custom polygons
}

export interface SnappingGuideline {
  points: number[]; // [x1, y1, x2, y2]
  orientation: 'V' | 'H'; // Vertical or Horizontal
}

interface SnappingLine {
  guide: number;    // Where to draw the guide line (X or Y coordinate)
  offset: number;   // How much to adjust the dragging shape's position to snap
  snap: number;     // The coordinate the shape will snap to
}

const SNAP_THRESHOLD = 12; // Snapping distance in pixels

/**
 * Computes snapping and visual guidelines when dragging a shape.
 * Looks at other shapes and the boundaries of the canvas.
 */
export function getSnappingCoordinates(
  draggingShape: FieldShape,
  otherShapes: FieldShape[],
  stageWidth: number,
  stageHeight: number
): { x: number; y: number; guidelines: SnappingGuideline[] } {
  
  // Calculate bounding box properties of the shape being dragged
  const w = draggingShape.width * (draggingShape.scaleX || 1);
  const h = draggingShape.height * (draggingShape.scaleY || 1);
  const x = draggingShape.x;
  const y = draggingShape.y;

  // Potential snapping lines for the dragged shape:
  // vertical lines (X-axis snap)
  const dragVLines = [
    { type: 'left', val: x, offset: 0 },
    { type: 'center', val: x + w / 2, offset: -w / 2 },
    { type: 'right', val: x + w, offset: -w }
  ];

  // horizontal lines (Y-axis snap)
  const dragHLines = [
    { type: 'top', val: y, offset: 0 },
    { type: 'center', val: y + h / 2, offset: -h / 2 },
    { type: 'bottom', val: y + h, offset: -h }
  ];

  // Let's collect all possible snaps from other shapes and stage edges
  const targetVLines: { val: number; label: string; shapeId?: string }[] = [
    { val: 0, label: 'stage-left' },
    { val: stageWidth, label: 'stage-right' }
  ];
  
  const targetHLines: { val: number; label: string; shapeId?: string }[] = [
    { val: 0, label: 'stage-top' },
    { val: stageHeight, label: 'stage-bottom' }
  ];

  otherShapes.forEach((shape) => {
    const sw = shape.width * (shape.scaleX || 1);
    const sh = shape.height * (shape.scaleY || 1);
    
    targetVLines.push(
      { val: shape.x, label: 'left', shapeId: shape.id },
      { val: shape.x + sw / 2, label: 'center', shapeId: shape.id },
      { val: shape.x + sw, label: 'right', shapeId: shape.id }
    );
    
    targetHLines.push(
      { val: shape.y, label: 'top', shapeId: shape.id },
      { val: shape.y + sh / 2, label: 'center', shapeId: shape.id },
      { val: shape.y + sh, label: 'bottom', shapeId: shape.id }
    );
  });

  let snappedX = x;
  let snappedY = y;
  const guidelines: SnappingGuideline[] = [];

  // Check vertical alignment (snapping along X-axis)
  let bestVLine: SnappingLine | null = null;
  let minVDiff = SNAP_THRESHOLD;

  for (const dragLine of dragVLines) {
    for (const targetLine of targetVLines) {
      const diff = Math.abs(dragLine.val - targetLine.val);
      if (diff < minVDiff) {
        minVDiff = diff;
        bestVLine = {
          guide: targetLine.val,
          offset: dragLine.offset,
          snap: targetLine.val + dragLine.offset
        };
      }
    }
  }

  if (bestVLine) {
    snappedX = bestVLine.snap;
    // Draw guide across the viewport height
    guidelines.push({
      points: [bestVLine.guide, 0, bestVLine.guide, stageHeight],
      orientation: 'V'
    });
  }

  // Check horizontal alignment (snapping along Y-axis)
  let bestHLine: SnappingLine | null = null;
  let minHDiff = SNAP_THRESHOLD;

  for (const dragLine of dragHLines) {
    for (const targetLine of targetHLines) {
      const diff = Math.abs(dragLine.val - targetLine.val);
      if (diff < minHDiff) {
        minHDiff = diff;
        bestHLine = {
          guide: targetLine.val,
          offset: dragLine.offset,
          snap: targetLine.val + dragLine.offset
        };
      }
    }
  }

  if (bestHLine) {
    snappedY = bestHLine.snap;
    // Draw guide across the viewport width
    guidelines.push({
      points: [0, bestHLine.guide, stageWidth, bestHLine.guide],
      orientation: 'H'
    });
  }

  return {
    x: snappedX,
    y: snappedY,
    guidelines
  };
}
