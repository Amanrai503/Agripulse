import React from 'react';
import { 
  Sprout, 
  Trash2, 
  Plus, 
  Grid, 
  Download, 
  Maximize2, 
  Minimize2, 
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  Lock,
  Thermometer,
  Droplets,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FieldShape } from './snapping-utils';

interface PresetSidebarProps {
  selectedShape: FieldShape | null;
  onUpdateShape: (updated: FieldShape) => void;
  onDeleteShape: (id: string) => void;
  onAddShape: (type: 'rect' | 'circle' | 'polygon', cropType: string, color: string) => void;
  snapToGrid: boolean;
  setSnapToGrid: (val: boolean) => void;
  onExport: () => void;
  onClear: () => void;
  isEditable: boolean;
}

export interface CropPreset {
  cropType: string;
  color: string;
  borderColor: string;
  gradientStart: string;
  gradientEnd: string;
  defaultShape: 'rect' | 'circle' | 'polygon';
  defaultWidth: number;
  defaultHeight: number;
  points?: number[]; // trapezoid standard coordinates
  yieldPerSqMeter: number; // in kg
  desc: string;
  tempCurrent: number;
  humidityCurrent: number;
  tempOptimalRange: string;
  humidityOptimalRange: string;
  marketPricePerKg: number; // in INR
  lastScanDate: string;
  lastScanHealth: 'Healthy' | 'Warning' | 'Diseased';
  lastScanDiagnosis: string;
}

export const CROP_PRESETS: Record<string, CropPreset> = {
  Tomato: {
    cropType: 'Tomato',
    color: '#ebc0c2', // pastel red/coral
    borderColor: '#d29699',
    gradientStart: '#f7d8d9',
    gradientEnd: '#ebc0c2',
    defaultShape: 'rect',
    defaultWidth: 160,
    defaultHeight: 120,
    yieldPerSqMeter: 5.8,
    desc: 'Dense vine rows, requires trellis. High moisture demand.',
    tempCurrent: 27.4,
    humidityCurrent: 64,
    tempOptimalRange: "21°C - 29°C",
    humidityOptimalRange: "60% - 70%",
    marketPricePerKg: 45,
    lastScanDate: "May 22, 2026",
    lastScanHealth: "Healthy",
    lastScanDiagnosis: "98% Optimal Health. Foliage is dense, roots are well-aerated. No leaf blight spots found."
  },
  Wheat: {
    cropType: 'Wheat',
    color: '#f0e3c9', // pastel gold/straw
    borderColor: '#dfcc9e',
    gradientStart: '#f7ebd3',
    gradientEnd: '#f0e3c9',
    defaultShape: 'rect',
    defaultWidth: 220,
    defaultHeight: 140,
    yieldPerSqMeter: 0.75,
    desc: 'Broadacre plot. Minimal daily management once established.',
    tempCurrent: 22.1,
    humidityCurrent: 48,
    tempOptimalRange: "15°C - 24°C",
    humidityOptimalRange: "45% - 60%",
    marketPricePerKg: 24,
    lastScanDate: "May 21, 2026",
    lastScanHealth: "Healthy",
    lastScanDiagnosis: "Excellent stem density and optimal leaf color. Dry canopy levels are perfect."
  },
  Corn: {
    cropType: 'Corn',
    color: '#e5ebc5', // pastel lime/corn
    borderColor: '#cdd79a',
    gradientStart: '#eff4d5',
    gradientEnd: '#e5ebc5',
    defaultShape: 'polygon', // Trapezoid!
    defaultWidth: 180,
    defaultHeight: 130,
    points: [0, 0, 180, 0, 150, 130, 20, 130], // Trapezoidal points relative to x, y
    yieldPerSqMeter: 1.2,
    desc: 'Staggered row crop. Substantial nutrient feeder.',
    tempCurrent: 30.5,
    humidityCurrent: 52, // slight drought stress
    tempOptimalRange: "24°C - 32°C",
    humidityOptimalRange: "55% - 75%",
    marketPricePerKg: 32,
    lastScanDate: "May 19, 2026",
    lastScanHealth: "Warning",
    lastScanDiagnosis: "Foliar water stress. Low moisture levels detected in soil. Increase drip irrigation cycles immediately."
  },
  Potato: {
    cropType: 'Potato',
    color: '#dbcfc3', // pastel earthy brown
    borderColor: '#bfad9c',
    gradientStart: '#ebdcd0',
    gradientEnd: '#dbcfc3',
    defaultShape: 'rect',
    defaultWidth: 150,
    defaultHeight: 100,
    yieldPerSqMeter: 3.4,
    desc: 'Root crop. Prefers loose, sandy soil and hilling cycles.',
    tempCurrent: 18.5,
    humidityCurrent: 76,
    tempOptimalRange: "15°C - 21°C",
    humidityOptimalRange: "70% - 80%",
    marketPricePerKg: 18,
    lastScanDate: "May 23, 2026",
    lastScanHealth: "Healthy",
    lastScanDiagnosis: "Optimal root development and excellent foliage expansion. Soil moisture is within target."
  },
  Grapes: {
    cropType: 'Grapes',
    color: '#d4c9f0', // pastel grape/lavender
    borderColor: '#b4a0e2',
    gradientStart: '#e5ddfa',
    gradientEnd: '#d4c9f0',
    defaultShape: 'circle', // Circular pivot plot
    defaultWidth: 140,
    defaultHeight: 140,
    yieldPerSqMeter: 2.1,
    desc: 'Trellised vines. Drip irrigation, needs high direct sunlight.',
    tempCurrent: 28.2,
    humidityCurrent: 58,
    tempOptimalRange: "25°C - 32°C",
    humidityOptimalRange: "50% - 65%",
    marketPricePerKg: 95,
    lastScanDate: "May 20, 2026",
    lastScanHealth: "Healthy",
    lastScanDiagnosis: "Healthy vegetative balance. Leaf clusters show strong green profiles. Zero pest markings."
  },
  Fallow: {
    cropType: 'Fallow Field',
    color: '#cbd5e1', // pastel slate/gray
    borderColor: '#94a3b8',
    gradientStart: '#e2e8f0',
    gradientEnd: '#cbd5e1',
    defaultShape: 'rect',
    defaultWidth: 140,
    defaultHeight: 100,
    yieldPerSqMeter: 0.0,
    desc: 'Soil regeneration rest phase. Ideal for clover coverage.',
    tempCurrent: 24.5,
    humidityCurrent: 55,
    tempOptimalRange: "N/A",
    humidityOptimalRange: "N/A",
    marketPricePerKg: 0,
    lastScanDate: "May 10, 2026",
    lastScanHealth: "Healthy",
    lastScanDiagnosis: "Nitrogen retention levels are rebuilding optimally. Idle field state is healthy."
  }
};

export function PresetSidebar({
  selectedShape,
  onUpdateShape,
  onDeleteShape,
  onAddShape,
  snapToGrid,
  setSnapToGrid,
  onExport,
  onClear,
  isEditable
}: PresetSidebarProps) {

  const handleDragStart = (e: React.DragEvent, key: string) => {
    if (!isEditable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('crop-preset-key', key);
  };

  // Get current selected shape details
  const getSelectedShapePreset = () => {
    if (!selectedShape) return null;
    return CROP_PRESETS[selectedShape.cropType] || CROP_PRESETS.Fallow;
  };

  const selectedPreset = getSelectedShapePreset();
  
  // Calculate area in square meters (scaling: 1px = 0.5 meters, so 1 sq px = 0.25 sq meters)
  const calcArea = (shape: FieldShape) => {
    const sw = shape.width * (shape.scaleX || 1);
    const sh = shape.height * (shape.scaleY || 1);
    let areaPx = sw * sh;
    if (shape.type === 'circle') {
      const radius = sw / 2;
      areaPx = Math.PI * radius * radius;
    }
    return Math.round(areaPx * 0.25); // Area in sq. meters
  };

  const getEstimatedYield = (shape: FieldShape) => {
    const area = calcArea(shape);
    const preset = CROP_PRESETS[shape.cropType] || CROP_PRESETS.Fallow;
    return Math.round(area * preset.yieldPerSqMeter);
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-100 flex flex-col h-full select-none">
      
      {/* Canvas Tool Controls */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Planner Canvas Settings</h3>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!isEditable}
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`w-full justify-start text-xs px-3 h-9 rounded-lg ${snapToGrid ? 'border-green-500 bg-green-50/50 text-green-700' : 'border-gray-200 text-gray-600'} disabled:opacity-50`}
          >
            <Grid className="w-3.5 h-3.5 mr-2" />
            Grid Snapping
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
            className="w-full justify-start text-xs px-3 h-9 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export Plan
          </Button>
        </div>
        {isEditable && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="w-full mt-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg justify-center h-8"
          >
            Reset Whole Layout
          </Button>
        )}
      </div>

      {/* Main Selector/Editor Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Always render list of presets to drag */}
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Draggable Presets</h3>
            <p className="text-[11px] text-gray-500">
              {isEditable ? "Drag crops onto the field canvas, or click the + to add instantly." : "Fields are read-only. Unlock editing above to add plots."}
            </p>
          </div>
          
          {!isEditable && (
            <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-3 flex gap-2.5 items-center mb-2 animate-in fade-in duration-300">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-[10px] text-amber-800 font-medium leading-tight">
                Farm Layout is locked. Click the <strong>Edit Farm Layout</strong> button to unlock editing.
              </div>
            </div>
          )}

          <div className="space-y-3">
            {Object.entries(CROP_PRESETS).map(([key, preset]) => {
              const ShapeIcon = preset.defaultShape === 'circle' ? 'Circle' : preset.defaultShape === 'polygon' ? 'Trapezoid' : 'Rectangle';
              return (
                <div
                  key={key}
                  draggable={isEditable}
                  onDragStart={(e) => handleDragStart(e, key)}
                  className={`group bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between transition-all border-l-4 ${
                    isEditable 
                      ? 'cursor-grab active:cursor-grabbing hover:border-green-300 hover:shadow-sm' 
                      : 'cursor-not-allowed opacity-75'
                  }`}
                  style={{ borderLeftColor: preset.borderColor }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{ 
                        background: `linear-gradient(135deg, ${preset.gradientStart}, ${preset.gradientEnd})`,
                        borderColor: preset.borderColor
                      }}
                    >
                      <Sprout className="w-4 h-4" style={{ color: preset.borderColor }} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold text-gray-800 leading-tight transition-colors ${isEditable ? 'group-hover:text-green-800' : ''}`}>{preset.cropType}</h4>
                      <span className="text-[10px] text-gray-400 font-medium capitalize">{preset.defaultShape === 'rect' ? 'Rectangle' : preset.defaultShape === 'circle' ? 'Circle Pivot' : 'Trapezoid'} ({preset.yieldPerSqMeter} kg/m²)</span>
                    </div>
                  </div>
                  
                  {isEditable && (
                    <button 
                      onClick={() => onAddShape(preset.defaultShape, preset.cropType, preset.color)}
                      className="w-7 h-7 bg-gray-50 hover:bg-green-50 rounded-md border border-gray-200 hover:border-green-200 flex items-center justify-center transition-colors"
                      title="Add directly to center"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-500 hover:text-green-600" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Guidelines banner */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 mt-4">
            <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-green-600" />
              Quick Guides
            </h4>
            <ul className="text-[10.5px] text-gray-500 space-y-1.5 list-disc pl-4 leading-normal">
              <li>Drag/resize fields to outline your farm sections.</li>
              <li>Hold `Delete` or `Backspace` to remove selected fields.</li>
              <li>Drag shapes close to align and **snap to edges** automatically.</li>
              <li>Double click a label in the canvas to customize crop name inline.</li>
            </ul>
          </div>
        </div>

      </div>
    </aside>
  );
}
