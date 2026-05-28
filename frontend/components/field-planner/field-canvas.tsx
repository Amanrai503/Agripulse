import React, { useState, useRef, useEffect } from 'react';
import { 
  Stage, 
  Layer, 
  Rect, 
  Circle, 
  Line, 
  Text, 
  Group, 
  Transformer 
} from 'react-konva';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Maximize, 
  MousePointer, 
  Hand,
  Settings2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldShape, SnappingGuideline, getSnappingCoordinates } from './snapping-utils';
import { CROP_PRESETS } from './preset-sidebar';

interface FieldCanvasProps {
  shapes: FieldShape[];
  setShapes: React.Dispatch<React.SetStateAction<FieldShape[]>>;
  selectedShape: FieldShape | null;
  setSelectedShape: (shape: FieldShape | null) => void;
  snapToGrid: boolean;
  stageRef: React.RefObject<any>;
  isEditable: boolean;
}

const GRID_SIZE = 30; // Grid cell size in pixels
const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 480;

export default function FieldCanvas({
  shapes,
  setShapes,
  selectedShape,
  setSelectedShape,
  snapToGrid,
  stageRef,
  isEditable
}: FieldCanvasProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'pan'>('select');
  const [guidelines, setGuidelines] = useState<SnappingGuideline[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editInputPos, setEditInputPos] = useState({ x: 0, y: 0, w: 100, h: 25 });
  const [isCollapsed, setIsCollapsed] = useState(true);

  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically disable select tool and clear selection when layout is locked/read-only
  useEffect(() => {
    if (!isEditable) {
      setTool('pan');
      setSelectedShape(null);
      setIsCollapsed(true);
    } else {
      setTool('select');
      setIsCollapsed(false);
    }
  }, [isEditable]);

  // Update Konva Transformer target node
  useEffect(() => {
    if (transformerRef.current) {
      if (selectedShape && isEditable) {
        const stage = transformerRef.current.getStage();
        const selectedNode = stage.findOne(`#group-${selectedShape.id}`);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
          return;
        }
      }
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShape, shapes, isEditable]);

  // Handle stage pan/zoom wheel events
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    // Limit zoom levels
    const boundedScale = Math.max(0.4, Math.min(newScale, 3));

    setScale(boundedScale);
    setPosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / boundedScale) * boundedScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / boundedScale) * boundedScale,
    });
  };

  const handleZoom = (factor: number) => {
    setScale((prev) => Math.max(0.4, Math.min(prev * factor, 3)));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Keyboard shortcut listener for deleting shapes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditable) return; // Disallow deletions when layout is locked
      if (editingId) return; // Ignore if user is editing a label
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShape) {
        setShapes((prev) => prev.filter((s) => s.id !== selectedShape.id));
        setSelectedShape(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShape, editingId, isEditable]);

  // Drop preset handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isEditable) return; // Ignore drops when layout is locked
    const presetKey = e.dataTransfer.getData('crop-preset-key');
    const preset = CROP_PRESETS[presetKey];
    if (!preset || !stageRef.current) return;

    const stage = stageRef.current;
    // Map mouse screen coordinate to canvas coordinates accounting for zoom and pan
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const stageX = (clientX - position.x) / scale;
    const stageY = (clientY - position.y) / scale;

    const newShape: FieldShape = {
      id: `field-${Date.now()}`,
      type: preset.defaultShape,
      x: Math.round(stageX - preset.defaultWidth / 2),
      y: Math.round(stageY - preset.defaultHeight / 2),
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      cropType: preset.cropType,
      color: preset.color,
      points: preset.points,
      scaleX: 1,
      scaleY: 1
    };

    setShapes((prev) => [...prev, newShape]);
    setSelectedShape(newShape);
  };

  // Drag and snap handlers
  const handleDragMove = (e: any, shape: FieldShape) => {
    const node = e.target;
    let newX = node.x();
    let newY = node.y();

    if (snapToGrid) {
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
      node.x(newX);
      node.y(newY);
      setGuidelines([]);
    } else {
      // Calculate advanced edge-snapping coordinates
      const tempShape = { ...shape, x: newX, y: newY };
      const otherShapes = shapes.filter((s) => s.id !== shape.id);
      const snappingResult = getSnappingCoordinates(
        tempShape,
        otherShapes,
        STAGE_WIDTH,
        STAGE_HEIGHT
      );

      newX = snappingResult.x;
      newY = snappingResult.y;

      node.x(newX);
      node.y(newY);
      setGuidelines(snappingResult.guidelines);
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    const node = e.target;
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id === id) {
          return {
            ...shape,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
          };
        }
        return shape;
      })
    );
    setGuidelines([]);
  };

  // Transform / resize handlers
  const handleTransformEnd = (e: any, id: string) => {
    const node = e.target;
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id === id) {
          return {
            ...shape,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          };
        }
        return shape;
      })
    );
  };

  // Double click to edit label
  const handleDoubleClick = (e: any, shape: FieldShape) => {
    const stage = stageRef.current;
    if (!stage) return;

    // Get absolute screen coordinates of label text
    const textNode = e.currentTarget.findOne('.label-text');
    if (!textNode) return;

    const absPos = textNode.getAbsolutePosition();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setEditingId(shape.id);
    setEditValue(shape.cropType);
    setEditInputPos({
      x: absPos.x - rect.left - 50, // center somewhat
      y: absPos.y - rect.top - 8,
      w: 120,
      h: 26,
    });
  };

  const handleInlineEditSubmit = () => {
    if (editingId) {
      setShapes((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, cropType: editValue } : s))
      );
      // Update selected shape if it was the one edited
      if (selectedShape?.id === editingId) {
        setSelectedShape({ ...selectedShape, cropType: editValue });
      }
      setEditingId(null);
    }
  };

  // Stage clicks to deselect
  const handleStageClick = (e: any) => {
    if (editingId) {
      handleInlineEditSubmit();
      return;
    }
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedShape(null);
    }
  };

  // Helper to calculate area label
  const getAreaLabel = (shape: FieldShape) => {
    const sw = shape.width * (shape.scaleX || 1);
    const sh = shape.height * (shape.scaleY || 1);
    let areaPx = sw * sh;
    if (shape.type === 'circle') {
      const r = sw / 2;
      areaPx = Math.PI * r * r;
    }
    const areaM2 = Math.round(areaPx * 0.25);
    return `${areaM2} m²`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f8faf7] relative">
      
      {/* Floating Canvas Toolbar */}
      {!isEditable && isCollapsed ? (
        <Button 
          onClick={() => setIsCollapsed(false)}
          className="absolute top-4 left-4 z-10 flex gap-2 px-3 py-1.5 bg-white/95 backdrop-blur shadow-sm rounded-xl border border-gray-100 items-center text-xs font-bold text-gray-500 hover:text-green-700 hover:border-green-200 hover:bg-green-50/10 transition-all select-none h-9 animate-in fade-in zoom-in-95 duration-200 cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5 text-green-600" />
          Zoom: {Math.round(scale * 100)}%
        </Button>
      ) : (
        <div className="absolute top-4 left-4 z-10 flex gap-1.5 p-1.5 bg-white/95 backdrop-blur shadow-sm rounded-xl border border-gray-100 items-center animate-in slide-in-from-left-2 fade-in duration-300">
          {isEditable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTool('select')}
              className={`w-9 h-9 rounded-lg ${tool === 'select' ? 'bg-green-50 text-green-700' : 'text-gray-500'}`}
              title="Select and Edit Plots"
            >
              <MousePointer className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTool('pan')}
            className={`w-9 h-9 rounded-lg ${tool === 'pan' ? 'bg-green-50 text-green-700' : 'text-gray-500'}`}
            title="Pan and Navigation Mode"
          >
            <Hand className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-5 bg-gray-200 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(1.2)}
            className="w-9 h-9 text-gray-500 hover:bg-gray-50 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(0.85)}
            className="w-9 h-9 text-gray-500 hover:bg-gray-50 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="w-9 h-9 text-gray-500 hover:bg-gray-50 rounded-lg"
            title="Reset Zoom/Position"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <span className="text-[10px] font-bold text-gray-400 px-2 font-mono select-none">
            {Math.round(scale * 100)}%
          </span>

          {!isEditable && (
            <>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                title="Collapse Controls"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Main Canvas Host Container */}
      <div 
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full h-full flex-1 outline-none relative overflow-hidden"
      >
        <Stage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === 'pan'}
          onWheel={handleWheel}
          onClick={handleStageClick}
          className={`w-full h-full bg-[#fcfdfa] ${tool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
          {/* Background Grid Layer */}
          <Layer>
            {snapToGrid && (
              <>
                {/* Horizontal grid lines */}
                {Array.from({ length: Math.ceil(STAGE_HEIGHT / GRID_SIZE) + 1 }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, i * GRID_SIZE, STAGE_WIDTH, i * GRID_SIZE]}
                    stroke="#eef1ec"
                    strokeWidth={1}
                    dash={[2, 4]}
                  />
                ))}
                {/* Vertical grid lines */}
                {Array.from({ length: Math.ceil(STAGE_WIDTH / GRID_SIZE) + 1 }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * GRID_SIZE, 0, i * GRID_SIZE, STAGE_HEIGHT]}
                    stroke="#eef1ec"
                    strokeWidth={1}
                    dash={[2, 4]}
                  />
                ))}
              </>
            )}
          </Layer>

          {/* Core Shape Fields Layer */}
          <Layer>
            {shapes.map((shape) => {
              const isSelected = selectedShape?.id === shape.id;
              
              // Base coordinates inside group are 0,0
              const w = shape.width;
              const h = shape.height;
              
              const preset = CROP_PRESETS[shape.cropType] || CROP_PRESETS.Fallow;

              return (
                <Group
                  key={shape.id}
                  id={`group-${shape.id}`}
                  x={shape.x}
                  y={shape.y}
                  rotation={shape.rotation || 0}
                  scaleX={shape.scaleX || 1}
                  scaleY={shape.scaleY || 1}
                  draggable={tool === 'select' && isEditable}
                  onDragMove={(e) => handleDragMove(e, shape)}
                  onDragEnd={(e) => handleDragEnd(e, shape.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                  onClick={(e) => {
                    e.cancelBubble = true; // Stop event bubbling to stage click
                    setSelectedShape(shape);
                  }}
                  onDblClick={(e) => {
                    if (isEditable) {
                      handleDoubleClick(e, shape);
                    }
                  }}
                >
                  
                  {/* Shape render switch */}
                  {shape.type === 'circle' ? (
                    <Circle
                      x={w / 2}
                      y={h / 2}
                      radius={w / 2}
                      fill={shape.color}
                      stroke={isSelected ? '#16a34a' : preset.borderColor}
                      strokeWidth={isSelected ? 3 : 2}
                      shadowColor="#1e3b21"
                      shadowBlur={8}
                      shadowOffset={{ x: 2, y: 3 }}
                      shadowOpacity={0.12}
                    />
                  ) : shape.type === 'polygon' && shape.points ? (
                    <Line
                      points={shape.points}
                      closed
                      fill={shape.color}
                      stroke={isSelected ? '#16a34a' : preset.borderColor}
                      strokeWidth={isSelected ? 3 : 2}
                      shadowColor="#1e3b21"
                      shadowBlur={8}
                      shadowOffset={{ x: 2, y: 3 }}
                      shadowOpacity={0.12}
                    />
                  ) : (
                    <Rect
                      x={0}
                      y={0}
                      width={w}
                      height={h}
                      cornerRadius={8}
                      fill={shape.color}
                      stroke={isSelected ? '#16a34a' : preset.borderColor}
                      strokeWidth={isSelected ? 3 : 2}
                      shadowColor="#1e3b21"
                      shadowBlur={8}
                      shadowOffset={{ x: 2, y: 3 }}
                      shadowOpacity={0.12}
                    />
                  )}

                  {/* Text Overlay Group */}
                  <Group x={0} y={h / 2 - 14}>
                    <Text
                      name="label-text"
                      text={shape.cropType}
                      width={w}
                      align="center"
                      fontSize={11.5}
                      fontStyle="bold"
                      fontFamily="Inter, system-ui, sans-serif"
                      fill="#2d402f"
                    />
                    <Text
                      text={getAreaLabel(shape)}
                      width={w}
                      align="center"
                      y={15}
                      fontSize={9.5}
                      fontStyle="medium"
                      fontFamily="Inter, system-ui, sans-serif"
                      fill="#64748b"
                    />
                  </Group>

                </Group>
              );
            })}

            {/* Selection transformer */}
            {tool === 'select' && isEditable && (
              <Transformer
                ref={transformerRef}
                borderStroke="#16a34a"
                borderStrokeWidth={2}
                anchorStroke="#16a34a"
                anchorFill="#ffffff"
                anchorSize={8}
                anchorCornerRadius={2}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit minimum sizing
                  if (newBox.width < 40 || newBox.height < 40) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>

          {/* Dynamic Snapping Guidelines Layer */}
          <Layer>
            {guidelines.map((line, idx) => (
              <Line
                key={`guide-${idx}`}
                points={line.points}
                stroke="#ef4444"
                strokeWidth={1.5}
                dash={[4, 4]}
              />
            ))}
          </Layer>
        </Stage>

        {/* Overlay Inline Label Text Input Editor */}
        {editingId && (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInlineEditSubmit();
              if (e.key === 'Escape') setEditingId(null);
            }}
            onBlur={handleInlineEditSubmit}
            className="absolute z-20 px-2 py-0.5 border border-green-500 rounded bg-white shadow-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-green-500"
            style={{
              left: `${editInputPos.x}px`,
              top: `${editInputPos.y}px`,
              width: `${editInputPos.w}px`,
              height: `${editInputPos.h}px`,
            }}
            autoFocus
          />
        )}
      </div>

    </div>
  );
}
