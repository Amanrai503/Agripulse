import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Activity, CheckCircle2, ShieldCheck, FileText, ChevronRight, Info, Check } from 'lucide-react';

export function AnalysisResult({ result }: { result: any }) {
  if (!result) return null;

  const severityColors: Record<string, { bg: string, text: string, border: string, glow: string }> = {
    'none': { bg: '#F0FFF4', text: '#276749', border: '#C6F6D5', glow: 'shadow-[0_0_15px_rgba(72,187,120,0.15)]' },
    'low': { bg: '#EBF8FF', text: '#2B6CB0', border: '#BEE3F8', glow: 'shadow-[0_0_15px_rgba(66,153,225,0.15)]' },
    'moderate': { bg: '#FFFBEB', text: '#B7791F', border: '#FEFCBF', glow: 'shadow-[0_0_15px_rgba(236,201,75,0.15)]' },
    'high': { bg: '#FFF5F5', text: '#C53030', border: '#FED7D7', glow: 'shadow-[0_0_15px_rgba(245,101,101,0.15)]' },
    'critical': { bg: '#1A0000', text: '#FF4444', border: '#FC8181', glow: 'shadow-[0_0_15px_rgba(255,68,68,0.15)]' }
  };
  
  const rawSeverity = String(result.severity || 'Moderate');
  const severityKey = rawSeverity.toLowerCase();
  const colors = severityColors[severityKey] || severityColors['moderate'];
  
  const severityLevel = rawSeverity.charAt(0).toUpperCase() + rawSeverity.slice(1).toLowerCase();
  const isHealthy = severityKey === 'none';

  const parseList = (text: string) => {
    if (!text) return [];
    return text.split(';').map(item => item.trim()).filter(item => item.length > 0);
  };

  const symptomsList = parseList(result.symptoms);
  const actionsList = parseList(result.solution);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 mt-12 w-full pb-16">
      
      {/* Header Card */}
      <div className={`bg-white rounded-[28px] p-10 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-md ${colors.glow}`}>
        {/* Soft Colored Left Accent Line */}
        <div className="absolute top-0 left-0 w-2 h-full transition-colors duration-500" style={{ backgroundColor: colors.text }}></div>
        
        <div className="pl-2 flex-1">
          <div className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider" style={{ color: colors.text }}>
            {isHealthy ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {isHealthy ? 'Healthy Crop Detected' : 'Disease Detected'}
          </div>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 tracking-tight leading-tight">{result.disease}</h3>
          
          <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed font-medium">
            {isHealthy 
              ? "Based on the scan, this plant appears healthy with no visible signs of fungal, bacterial, or viral infections. Continue your current care routines." 
              : `Based on the scan, this plant shows strong indicators of ${result.disease}. Immediate attention is recommended to prevent further spread and yield loss.`}
          </p>

          <div className="flex flex-wrap gap-3">
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0 rounded-full px-5 py-2 text-sm font-semibold shadow-none transition-colors">
              {result.crop_type || 'Unknown Crop'}
            </Badge>
            <Badge 
              className="border-0 rounded-full px-5 py-2 text-sm font-semibold shadow-none transition-colors"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {severityLevel} Severity
            </Badge>
            {!isHealthy && (
              <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0 rounded-full px-5 py-2 text-sm font-semibold shadow-none transition-colors">
                Needs Attention
              </Badge>
            )}
          </div>
        </div>
        
        <div className="shrink-0 lg:w-72 bg-gray-50 rounded-3xl p-6 border border-gray-100/50 flex flex-col justify-center text-left">
          <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Confidence Score</div>
          <div className="text-5xl sm:text-6xl font-black text-[#059669] tracking-tighter mb-4">{result.confidence}%</div>
          <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#059669] h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${result.confidence}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Scan Preview */}
        <div className="bg-white rounded-[28px] p-8 flex flex-col shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <Info className="w-6 h-6 text-gray-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Scan Preview</h4>
          </div>
          <div className="flex-1 rounded-[24px] overflow-hidden bg-slate-900 relative z-0 shadow-inner flex items-center justify-center p-6 min-h-[360px] cursor-pointer" onClick={() => window.open(result.image_url, '_blank')}>
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150"></div>
            <img 
              src={result.image_url || '/placeholder.png'} 
              alt="Scan" 
              className="relative z-10 w-full h-[75%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm z-20">
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                View Full Resolution
              </span>
            </div>
          </div>
        </div>

        {/* Disease Overview */}
        <div className="bg-white rounded-[28px] p-8 flex flex-col shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Disease Overview</h4>
          </div>
          <div className="flex-1 rounded-[24px] bg-gray-50/50 border border-gray-100/50 p-8 overflow-y-auto">
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              {result.description}
            </p>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-[28px] p-8 flex flex-col shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Observed Symptoms</h4>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {symptomsList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                  <div className={`mt-1 rounded-full p-1.5 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600 leading-relaxed text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="bg-white rounded-[28px] p-8 flex flex-col shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Recommended Actions</h4>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {actionsList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-green-50/50 border border-transparent hover:border-green-100 transition-colors group">
                  <div className="mt-1 rounded-full p-1.5 bg-green-100 text-green-600 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600 leading-relaxed text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-white rounded-[28px] p-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <span className="text-gray-800 font-bold text-lg whitespace-nowrap">Assign to Field</span>
          <select defaultValue="" className="border border-gray-200 rounded-xl px-5 py-3.5 bg-gray-50 text-gray-800 font-semibold w-full sm:w-[280px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm">
            <option value="" disabled>Select a field location...</option>
            <option value="1">North Ridge A1</option>
            <option value="2">East Valley C2</option>
            <option value="3">South Creek B4</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="outline" className="hidden lg:flex border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-xl px-6 h-14 text-base font-bold shadow-sm transition-all hover:border-gray-300">
            Disease Encyclopedia
          </Button>
          <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 h-14 text-lg font-bold shadow-md shadow-green-600/20 transition-all hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5">
            Save Scan Result
          </Button>
        </div>

      </div>
    </div>
  );
}
