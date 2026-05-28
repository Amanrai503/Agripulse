"use client";

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/sidebar';
import { TopNavbar } from '@/components/top-navbar';
import { 
  Map, 
  Layers, 
  HelpCircle, 
  Calendar,
  Sparkles,
  TrendingUp,
  MapPin,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FieldShape } from '@/components/field-planner/snapping-utils';
import { PresetSidebar, CROP_PRESETS } from '@/components/field-planner/preset-sidebar';
import FieldDetailsPanel from '@/components/field-planner/field-details-panel';

// Load Konva Canvas dynamically without SSR to prevent server-side canvas window reference issues
const FieldCanvas = dynamic(
  () => import('@/components/field-planner/field-canvas'),
  { ssr: false }
);

// Initial mock shapes matching the user's reference image layout!
const INITIAL_SHAPES: FieldShape[] = [
  {
    id: 'field-initial-1',
    type: 'rect',
    x: 40,
    y: 40,
    width: 250,
    height: 180,
    cropType: 'Tomato',
    color: '#ebc0c2', // Red/Crimson pastel
    scaleX: 1,
    scaleY: 1
  },
  {
    id: 'field-initial-2',
    type: 'polygon',
    x: 305,
    y: 40,
    width: 260,
    height: 180,
    cropType: 'Corn',
    color: '#e5ebc5', // lime/gold pastel
    points: [0, 0, 260, 0, 230, 180, 5, 180], // trapezoid points relative to group
    scaleX: 1,
    scaleY: 1
  },
  {
    id: 'field-initial-3',
    type: 'rect',
    x: 40,
    y: 235,
    width: 185,
    height: 190,
    cropType: 'Potato',
    color: '#dbcfc3', // earthy brown
    scaleX: 1,
    scaleY: 1
  },
  {
    id: 'field-initial-4',
    type: 'rect',
    x: 240,
    y: 235,
    width: 325,
    height: 190,
    cropType: 'Grapes',
    color: '#d4c9f0', // lavender grapes
    scaleX: 1,
    scaleY: 1
  }
];

export default function FieldManagementPage() {
  const [shapes, setShapes] = useState<FieldShape[]>(INITIAL_SHAPES);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false); // Initially read-only/un-editable
  const stageRef = useRef<any>(null);

  const selectedShape = shapes.find(s => s.id === selectedShapeId) || null;

  const handleUpdateShape = (updatedShape: FieldShape) => {
    if (!isEditable) return;
    setShapes(prev => prev.map(s => s.id === updatedShape.id ? updatedShape : s));
  };

  const handleDeleteShape = (id: string) => {
    if (!isEditable) return;
    setShapes(prev => prev.filter(s => s.id !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  const handleAddShape = (type: 'rect' | 'circle' | 'polygon', cropType: string, color: string) => {
    if (!isEditable) return;
    const preset = CROP_PRESETS[cropType] || CROP_PRESETS.Fallow;
    const newShape: FieldShape = {
      id: `field-${Date.now()}`,
      type,
      x: 150 + Math.random() * 50,
      y: 150 + Math.random() * 50,
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      cropType,
      color,
      points: preset.points,
      scaleX: 1,
      scaleY: 1
    };
    setShapes(prev => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const handleClearAll = () => {
    if (!isEditable) return;
    if (confirm("Are you sure you want to clear your current farm layout? This cannot be undone.")) {
      setShapes([]);
      setSelectedShapeId(null);
    }
  };

  const handleExportLayout = () => {
    if (!stageRef.current) return;
    
    // Deselect shape temporarily before export for clean image
    setSelectedShapeId(null);
    
    // Allow React state to flush and clear active transformer outlines
    setTimeout(() => {
      try {
        const dataURL = stageRef.current.toDataURL({
          pixelRatio: 2, // High resolution export
          mimeType: 'image/png'
        });
        
        const link = document.createElement('a');
        link.download = `Farm_Layout_Planner_${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Export layout failed:", err);
        alert("Unable to export canvas layout due to cross-origin image layers or security restrictions.");
      }
    }, 100);
  };

  // Aggregated KPI Stats
  const totalPlots = shapes.length;
  
  const totalAreaM2 = Math.round(
    shapes.reduce((sum, shape) => {
      const sw = shape.width * (shape.scaleX || 1);
      const sh = shape.height * (shape.scaleY || 1);
      let areaPx = sw * sh;
      if (shape.type === 'circle') {
        const r = sw / 2;
        areaPx = Math.PI * r * r;
      }
      return sum + areaPx;
    }, 0) * 0.25
  );

  const totalYieldKg = Math.round(
    shapes.reduce((sum, shape) => {
      const sw = shape.width * (shape.scaleX || 1);
      const sh = shape.height * (shape.scaleY || 1);
      let areaPx = sw * sh;
      if (shape.type === 'circle') {
        const r = sw / 2;
        areaPx = Math.PI * r * r;
      }
      const areaM2 = areaPx * 0.25;
      const preset = CROP_PRESETS[shape.cropType] || CROP_PRESETS.Fallow;
      return sum + (areaM2 * preset.yieldPerSqMeter);
    }, 0)
  );

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar />
        
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1500px] w-full mx-auto flex flex-col gap-6 pb-8">
            
            {/* Header section with KPIs */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600/10 hover:bg-green-600/10 text-green-700 font-bold border-transparent px-2.5 rounded-full flex gap-1 items-center">
                    <Sparkles className="w-3.5 h-3.5 fill-green-600 text-green-600 animate-pulse" />
                    Field Mapper
                  </Badge>
                  {isEditable ? (
                    <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 border-transparent px-2.5 rounded-full flex gap-1 items-center font-bold text-[10px]">
                      <Unlock className="w-3 h-3" />
                      EDIT MODE ENABLED
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-500 border-transparent px-2.5 rounded-full flex gap-1 items-center font-bold text-[10px]">
                      <Lock className="w-3 h-3 text-gray-400" />
                      LOCKED READ-ONLY
                    </Badge>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Farm Layout & Field Management</h2>
                <p className="text-gray-500 text-sm max-w-2xl mt-0.5">
                  Outline crop sections, drag and snap custom shapes, and calculate expected yields in real-time.
                </p>
                
                {/* Editable toggle button */}
                <div className="mt-3">
                  {isEditable ? (
                    <Button 
                      onClick={() => {
                        setIsEditable(false);
                        setSelectedShapeId(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-10 shadow-sm transition-all text-xs font-semibold px-5"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Layout & Lock
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsEditable(true)}
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl h-10 shadow-sm transition-all text-xs font-semibold px-5"
                    >
                      <Unlock className="w-4 h-4 mr-2 text-green-600" />
                      Edit Farm Layout
                    </Button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="flex flex-wrap gap-4 items-center">
                <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden min-w-[130px] p-4 flex gap-3 items-center">
                  <div className="bg-green-50 p-2.5 rounded-xl">
                    <Layers className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Plots</span>
                    <span className="text-xl font-bold text-gray-800">{totalPlots} Fields</span>
                  </div>
                </Card>

                <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden min-w-[140px] p-4 flex gap-3 items-center">
                  <div className="bg-blue-50 p-2.5 rounded-xl">
                    <Map className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Mapped Area</span>
                    <span className="text-xl font-bold text-gray-800">{totalAreaM2.toLocaleString()} m²</span>
                  </div>
                </Card>

                <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden min-w-[160px] p-4 flex gap-3 items-center">
                  <div className="bg-amber-50 p-2.5 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Potential Yield</span>
                    <span className="text-xl font-bold text-gray-800">{totalYieldKg.toLocaleString()} kg</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Canvas + Sidebar Workspace Layout */}
            <div className="h-[480px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              
              {/* Dynamic Konva Interactive Canvas workspace */}
              <FieldCanvas
                shapes={shapes}
                setShapes={setShapes}
                selectedShape={selectedShape}
                setSelectedShape={(shape) => setSelectedShapeId(shape ? shape.id : null)}
                snapToGrid={snapToGrid}
                stageRef={stageRef}
                isEditable={isEditable}
              />

              {/* Crop Preset Selector & Details sidebar */}
              <PresetSidebar
                selectedShape={selectedShape}
                onUpdateShape={handleUpdateShape}
                onDeleteShape={handleDeleteShape}
                onAddShape={handleAddShape}
                snapToGrid={snapToGrid}
                setSnapToGrid={setSnapToGrid}
                onExport={handleExportLayout}
                onClear={handleClearAll}
                isEditable={isEditable}
              />

            </div>

            {/* Detailed plot statistics/inspector panel rendered below the Farm Layout */}
            {selectedShape && (
              <FieldDetailsPanel
                selectedShape={selectedShape}
                isEditable={isEditable}
                onUpdateShape={handleUpdateShape}
                onDeleteShape={handleDeleteShape}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
