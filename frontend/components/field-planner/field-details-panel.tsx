import React from 'react';
import { 
  Sprout, 
  Trash2, 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FieldShape } from './snapping-utils';
import { CROP_PRESETS } from './preset-sidebar';

interface FieldDetailsPanelProps {
  selectedShape: FieldShape;
  isEditable: boolean;
  onUpdateShape: (updated: FieldShape) => void;
  onDeleteShape: (id: string) => void;
}

export default function FieldDetailsPanel({
  selectedShape,
  isEditable,
  onUpdateShape,
  onDeleteShape
}: FieldDetailsPanelProps) {
  
  const preset = CROP_PRESETS[selectedShape.cropType] || CROP_PRESETS.Fallow;

  // Calculate area in square meters
  const calcArea = () => {
    const sw = selectedShape.width * (selectedShape.scaleX || 1);
    const sh = selectedShape.height * (selectedShape.scaleY || 1);
    let areaPx = sw * sh;
    if (selectedShape.type === 'circle') {
      const radius = sw / 2;
      areaPx = Math.PI * radius * radius;
    }
    return Math.round(areaPx * 0.25);
  };

  const area = calcArea();
  const estimatedYieldKg = Math.round(area * preset.yieldPerSqMeter);
  const estimatedValueINR = estimatedYieldKg * preset.marketPricePerKg;

  return (
    <Card className="w-full border border-gray-100 shadow-md rounded-2xl overflow-hidden bg-white animate-in slide-in-from-bottom-4 duration-300">
      
      {/* Header section of the details panel */}
      <div 
        className="px-6 py-3 border-b flex items-center justify-between gap-4"
        style={{ background: `linear-gradient(to right, ${preset.gradientStart}15, ${preset.gradientEnd}15)` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm"
            style={{ 
              background: `linear-gradient(135deg, ${preset.gradientStart}, ${preset.gradientEnd})`,
              borderColor: preset.borderColor
            }}
          >
            <Sprout className="w-5 h-5" style={{ color: preset.borderColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-gray-900 leading-tight">{selectedShape.cropType} Plot</h4>
              {isEditable ? (
                <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 font-bold border-transparent px-2.5 rounded-full text-[9px] h-4">
                  INSPECTOR MODE
                </Badge>
              ) : (
                preset.lastScanHealth === 'Healthy' ? (
                  <Badge className="bg-green-100 hover:bg-green-100 text-green-700 font-bold border-transparent px-2.5 rounded-full text-[9px] h-4">
                    ● HEALTHY PLOT
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 font-bold border-transparent px-2.5 rounded-full text-[9px] h-4 animate-pulse">
                    ▲ STRESS DETECTED
                  </Badge>
                )
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-semibold uppercase block mt-0.5">
              {selectedShape.type === 'circle' ? 'Circular Pivot Field' : selectedShape.type === 'polygon' ? 'Polygonal Layout' : 'Rectangular Plot'} Mapped Section
            </span>
          </div>
        </div>

        <div className="flex gap-2 text-right text-xs text-gray-500 font-semibold">
          <span>Dimensions: {Math.round(selectedShape.width * (selectedShape.scaleX || 1))}m × {Math.round(selectedShape.height * (selectedShape.scaleY || 1))}m</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-700 font-bold">Area: {area.toLocaleString()} m²</span>
        </div>
      </div>

      <CardContent className="p-6">
        {!isEditable ? (
          /* Locked Read-Only Diagnostics Dashboard View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Climate Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Plot Climate Health</span>
              </div>
              
              <div className="space-y-2.5">
                {/* Temperature */}
                <div className="flex justify-between items-center bg-gray-50/70 p-3 rounded-xl border border-gray-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-orange-50 p-1.5 rounded-lg">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-500 font-bold block">Air Temp</span>
                      <span className="text-[9px] text-gray-400">Optimal: {preset.tempOptimalRange}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-gray-800 block">{preset.tempCurrent}°C</span>
                    <Badge className="bg-green-50 text-green-700 border-transparent text-[8px] font-bold py-0.5 px-1.5 rounded-sm shadow-none">
                      OPTIMAL
                    </Badge>
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex justify-between items-center bg-gray-50/70 p-3 rounded-xl border border-gray-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <Droplets className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-500 font-bold block">Soil Humidity</span>
                      <span className="text-[9px] text-gray-400">Optimal: {preset.humidityOptimalRange}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-gray-800 block">{preset.humidityCurrent}%</span>
                    {preset.humidityCurrent < 55 && preset.cropType === 'Corn' ? (
                      <Badge className="bg-amber-50 text-amber-700 border-transparent text-[8px] font-bold py-0.5 px-1.5 rounded-sm shadow-none">
                        DRY
                      </Badge>
                    ) : (
                      <Badge className="bg-green-50 text-green-700 border-transparent text-[8px] font-bold py-0.5 px-1.5 rounded-sm shadow-none">
                        OPTIMAL
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Expected Harvest & Economics */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Harvest & Economics</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 h-[116px]">
                <div className="bg-amber-50/40 border border-amber-100/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <span className="text-[9px] font-bold text-amber-600 uppercase block tracking-wider">Est. Harvest Yield</span>
                  <div>
                    <span className="text-2xl font-extrabold text-gray-800 block leading-tight">
                      {estimatedYieldKg.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">Kilograms (kg)</span>
                  </div>
                </div>

                <div className="bg-green-50/30 border border-green-100/40 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <span className="text-[9px] font-bold text-green-600 uppercase block tracking-wider">Est. Market Value</span>
                  <div>
                    <span className="text-2xl font-extrabold text-green-700 block leading-tight">
                      ₹{estimatedValueINR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">Value index: ₹{preset.marketPricePerKg}/kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: AI Diagnostics History & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">AI Diagnostics Report</span>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-2.5 flex-1 items-start">
                  {preset.lastScanHealth === 'Healthy' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Last scan: {preset.lastScanDate}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                      {preset.lastScanDiagnosis}
                    </p>
                  </div>
                </div>
                
                <a href="/scanner" className="shrink-0 flex flex-col justify-center">
                  <Button className="bg-[#3d5a3e] hover:bg-[#2d432e] text-white rounded-xl h-10 px-4 text-xs font-semibold shadow-sm transition-all flex items-center justify-center">
                    New Scan
                  </Button>
                </a>
              </div>
            </div>

          </div>
        ) : (
          /* Editable Field Inspector View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Column 1: Plot Specifications */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <Layers className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Edit Plot Configuration</span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Crop Type</label>
                  <select 
                    className="w-full border border-gray-200 text-sm font-semibold rounded-lg px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    value={selectedShape.cropType}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const matchedPreset = CROP_PRESETS[selectedVal];
                      if (matchedPreset) {
                        onUpdateShape({
                          ...selectedShape,
                          cropType: selectedVal,
                          color: matchedPreset.color
                        });
                      }
                    }}
                  >
                    {Object.keys(CROP_PRESETS).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4 text-xs font-semibold text-gray-600">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Mapped Area</span>
                  <span className="text-sm font-bold text-gray-700">{area.toLocaleString()} m²</span>
                </div>
              </div>
            </div>

            {/* Column 2: Live Yield Calculation Display */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Live Harvest Calculations</span>
              </div>

              <div className="flex gap-6 items-center">
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Estimated Yield</span>
                  <span className="text-base font-extrabold text-gray-800">{estimatedYieldKg.toLocaleString()} kg</span>
                  <span className="block text-[9px] text-gray-400 mt-0.5">{preset.yieldPerSqMeter} kg/m² standard</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Est. Value (INR)</span>
                  <span className="text-base font-extrabold text-green-700">₹{estimatedValueINR.toLocaleString()}</span>
                  <span className="block text-[9px] text-gray-400 mt-0.5">At ₹{preset.marketPricePerKg}/kg index</span>
                </div>
              </div>
            </div>

            {/* Column 3: Edit Actions */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5 border-b pb-2 border-gray-100">
                <Info className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Plot Actions</span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-[10px] text-gray-400 font-medium leading-normal flex-1">
                  Plot tip: {preset.desc} Drag handles in the canvas to resize this field or delete it permanently.
                </div>
                
                <Button 
                  variant="destructive" 
                  className="rounded-xl text-xs font-bold h-10 px-5 shadow-sm hover:shadow transition-all shrink-0"
                  onClick={() => onDeleteShape(selectedShape.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Plot
                </Button>
              </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
