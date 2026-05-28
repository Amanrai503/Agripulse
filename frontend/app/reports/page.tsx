"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import {
  Calendar,
  Download,
  Eye,
  ArrowRight,
  FileText,
  FileSpreadsheet,
  Share2,
  Printer,
  ChevronRight,
  TrendingUp,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Activity,
  Map,
  ScanLine,
  Sparkles,
  Info,
  Clock,
  X,
  Gauge
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define mock data for Field Details Modal
interface FieldDetail {
  name: string;
  crop: string;
  health: number;
  lastScan: string;
  risk: "Low" | "Medium" | "High";
  acres: number;
  expectedYield: string;
  soilMoisture: string;
  nitrogenLevel: string;
}

const FIELD_DETAILS: Record<string, FieldDetail> = {
  "North Plot": {
    name: "North Plot",
    crop: "Wheat",
    health: 91,
    lastScan: "2 days ago",
    risk: "Low",
    acres: 4.5,
    expectedYield: "14.4 tons",
    soilMoisture: "38%",
    nitrogenLevel: "Optimal"
  },
  "East Plot": {
    name: "East Plot",
    crop: "Tomato",
    health: 63,
    lastScan: "Today",
    risk: "High",
    acres: 2.8,
    expectedYield: "8.1 tons",
    soilMoisture: "19% (Low)",
    nitrogenLevel: "Critical Deficiency"
  },
  "South Plot": {
    name: "South Plot",
    crop: "Chili",
    health: 78,
    lastScan: "1 day ago",
    risk: "Medium",
    acres: 3.2,
    expectedYield: "6.4 tons",
    soilMoisture: "31%",
    nitrogenLevel: "Moderate"
  },
  "West Plot": {
    name: "West Plot",
    crop: "Cotton",
    health: 88,
    lastScan: "3 days ago",
    risk: "Low",
    acres: 5.0,
    expectedYield: "11.2 tons",
    soilMoisture: "42%",
    nitrogenLevel: "Optimal"
  },
  "Central Plot": {
    name: "Central Plot",
    crop: "Rice",
    health: 55,
    lastScan: "Today",
    risk: "High",
    acres: 3.5,
    expectedYield: "9.6 tons",
    soilMoisture: "62% (Saturated)",
    nitrogenLevel: "Moderate Over-saturation"
  }
};

export default function ReportsPage() {
  const router = useRouter();

  // Dialog / Modal States
  const [selectedField, setSelectedField] = useState<FieldDetail | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [timeRange, setTimeRange] = useState("May 1 - May 31, 2025");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExport = (type: "PDF" | "CSV" | "Share" | "Print" | "All") => {
    if (type === "Print") {
      window.print();
      return;
    }

    if (type === "Share") {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Report link copied to clipboard!");
      return;
    }

    triggerToast(`Generating & exporting ${type} report...`);
    setShowExportModal(true);
    setTimeout(() => {
      setShowExportModal(false);
      triggerToast(`${type} Report successfully downloaded!`);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900 print:bg-white print:text-black">
      {/* Hide sidebar when printing */}
      <div className="print:hidden">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Hide navbar when printing */}
        <div className="print:hidden">
          <TopNavbar />
        </div>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto space-y-8 print:p-0 print:max-w-full">
          
          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-6 duration-300 print:hidden">
              <div className="bg-slate-900 text-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3 border border-slate-800">
                <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold tracking-tight">{toastMsg}</p>
              </div>
            </div>
          )}

          {/* Export Generation Modal */}
          {showExportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto border border-green-100">
                  <Download className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-950">Generating Report</h3>
                  <p className="text-xs text-slate-400">Assembling spectral charts & disease registry datasets...</p>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full w-2/3 animate-pulse" style={{ animationDuration: "1.5s" }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Field Details Modal */}
          {selectedField && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2.5 rounded-xl border border-green-100 text-green-700">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{selectedField.name}</h3>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{selectedField.crop} Section</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedField(null)}
                    className="p-1 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Health Integrity Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-800">{selectedField.health}%</span>
                      <Badge className={`h-4.5 text-[9px] font-bold border-transparent ${
                        selectedField.health >= 80 ? "bg-green-50 text-green-700" :
                        selectedField.health >= 60 ? "bg-amber-50 text-amber-700 animate-pulse" :
                        "bg-rose-50 text-rose-700 animate-pulse"
                      }`}>
                        {selectedField.health >= 80 ? "EXCELLENT" : selectedField.health >= 60 ? "STRESSED" : "CRITICAL"}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Outbreak Risk Potential</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-800">{selectedField.risk}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedField.risk === "Low" ? "bg-green-500" :
                        selectedField.risk === "Medium" ? "bg-amber-500 animate-pulse" :
                        "bg-rose-500 animate-pulse"
                      }`}></span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Soil Moisture</span>
                    <span className="text-sm font-black text-slate-800 block">{selectedField.soilMoisture}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Nitrogen (N) Content</span>
                    <span className="text-sm font-black text-slate-800 block">{selectedField.nitrogenLevel}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Total Plot Area</span>
                    <span className="text-sm font-black text-slate-800 block">{selectedField.acres} Hectares</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Expected Yield Estimate</span>
                    <span className="text-sm font-black text-emerald-800 block">{selectedField.expectedYield}</span>
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last analyzed: {selectedField.lastScan}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setSelectedField(null)}
                      variant="outline" 
                      className="h-9 px-4 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Close View
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedField(null);
                        router.push("/field-management");
                      }}
                      className="h-9 px-4 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white border-0"
                    >
                      Map Planner
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAIN PAGE HEADER WITH ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100/60 pb-6 print:pb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Reports</h2>
              <p className="text-gray-500 text-sm max-w-2xl">
                Track your farm health, disease activity and performance.
              </p>
            </div>
            
            {/* Action Bar (Calendar & Export Button) */}
            <div className="flex items-center gap-3 self-start sm:self-center print:hidden relative">
              <div className="relative">
                <button 
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl px-4 h-10 flex items-center gap-2 shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {timeRange}
                </button>
                {showDateDropdown && (
                  <div className="absolute right-0 top-12 z-20 w-48 bg-white border border-slate-100 rounded-xl shadow-lg p-2 space-y-1 animate-in slide-in-from-top-2 duration-150">
                    {[
                      "May 1 - May 31, 2025",
                      "April 1 - April 30, 2025",
                      "Last 30 Days",
                      "Current Quarter"
                    ].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setShowDateDropdown(false);
                          triggerToast(`Time range updated to ${range}`);
                        }}
                        className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                          timeRange === range ? "bg-green-50 text-green-700" : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={() => handleExport("All")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-10 px-4 text-xs flex items-center gap-2 shadow-sm transition-all border-0"
              >
                <Download className="w-4 h-4 text-slate-300" />
                Export Report
              </Button>
            </div>
          </div>

          {/* 1. FARM HEALTH OVERVIEW */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
              1. Farm Health Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* Card 1: Total Fields */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <Map className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Total Fields</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-0.5">12</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block">Fields</span>
                </div>
              </div>

              {/* Card 2: Healthy Crops */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Healthy Crops</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-0.5">82%</h4>
                  <span className="text-[10px] text-emerald-600 font-bold block">Healthy</span>
                </div>
              </div>

              {/* Card 3: Diseased Crops */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Diseased Crops</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-0.5">18%</h4>
                  <span className="text-[10px] text-amber-600 font-bold block">Needing Attention</span>
                </div>
              </div>

              {/* Card 4: Scans This Month */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <ScanLine className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Scans This Month</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-0.5">37</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block">Scans</span>
                </div>
              </div>

              {/* Card 5: Most Common Disease */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Most Common Disease</span>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5 truncate">Leaf Spot</h4>
                  <span className="text-[10px] text-rose-600 font-bold block">24% of cases</span>
                </div>
              </div>

              {/* Card 6: High Risk Fields */}
              <div className="bg-rose-50/30 rounded-2xl p-4 border border-rose-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-rose-100/50 rounded-lg flex items-center justify-center text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">High Risk Fields</span>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-0.5">5</h4>
                  <span className="text-[10px] text-rose-600 font-bold block">Fields</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. DISEASE DETECTION TRENDS & 3. DISEASE DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Disease Detection Trends */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">2. Disease Detection Trends</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                      All Diseases
                    </span>
                    <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-semibold focus:outline-none">
                      <option>Weekly</option>
                      <option>Daily</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                {/* SVG Trend Line Chart */}
                <div className="relative w-full h-[220px] pt-4 select-none">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
                    {[50, 40, 30, 20, 10, 0].map((val) => (
                      <div key={val} className="w-full flex items-center text-[10px] font-bold text-slate-300">
                        <span className="w-6 shrink-0">{val}</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                      </div>
                    ))}
                  </div>

                  {/* SVG Canvas for Chart path */}
                  <svg className="absolute left-6 right-0 top-4 bottom-8 w-[calc(100%-24px)] h-[calc(100%-32px)] overflow-visible">
                    <defs>
                      <linearGradient id="trend-area-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Filled Area path */}
                    <path
                      d="M 10 160 Q 60 120 110 130 T 210 90 T 310 60 T 410 80 T 510 50 L 510 180 L 10 180 Z"
                      fill="url(#trend-area-grad)"
                      className="transition-all duration-1000"
                    />

                    {/* Smooth Spline path */}
                    <path
                      d="M 10 160 Q 60 120 110 130 T 210 90 T 310 60 T 410 80 T 510 50"
                      fill="transparent"
                      stroke="#047857"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Chart interactive points */}
                    {[
                      { x: 10, y: 160, label: "10" },
                      { x: 110, y: 130, label: "23" },
                      { x: 210, y: 90, label: "20" },
                      { x: 310, y: 60, label: "33" },
                      { x: 410, y: 80, label: "26" },
                      { x: 510, y: 50, label: "30" }
                    ].map((pt, i) => (
                      <g key={i} className="group cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#ffffff"
                          stroke="#047857"
                          strokeWidth="3"
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill="#047857"
                          fillOpacity="0"
                          className="group-hover:fill-opacity-10 transition-all"
                        />
                      </g>
                    ))}
                  </svg>

                  {/* X Axis Labels */}
                  <div className="absolute left-6 right-0 bottom-0 flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Apr 27</span>
                    <span>May 4</span>
                    <span>May 11</span>
                    <span>May 18</span>
                    <span>May 25</span>
                    <span>May 31</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Disease Distribution */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-4">3. Disease Distribution</h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-full">
                
                {/* SVG Donut */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Leaf Spot - 40% (deep emerald) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="text-emerald-800 stroke-current"
                      strokeWidth="10"
                      strokeDasharray="238.7"
                      strokeDashoffset="143.2" // 238.7 - (0.40 * 238.7)
                      fill="transparent"
                    />
                    {/* Rust - 25% (emerald/green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="text-emerald-500 stroke-current"
                      strokeWidth="10"
                      strokeDasharray="238.7"
                      strokeDashoffset="179.0"
                      fill="transparent"
                      transform="rotate(144, 50, 50)"
                    />
                    {/* Blight - 20% (grayish slate) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="text-slate-500 stroke-current"
                      strokeWidth="10"
                      strokeDasharray="238.7"
                      strokeDashoffset="191.0"
                      fill="transparent"
                      transform="rotate(234, 50, 50)"
                    />
                    {/* Powdery Mildew - 10% (medium gray) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="text-slate-300 stroke-current"
                      strokeWidth="10"
                      strokeDasharray="238.7"
                      strokeDashoffset="214.8"
                      fill="transparent"
                      transform="rotate(306, 50, 50)"
                    />
                    {/* Healthy - 15% (light green/gray) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="text-emerald-100 stroke-current"
                      strokeWidth="10"
                      strokeDasharray="238.7"
                      strokeDashoffset="202.9"
                      fill="transparent"
                      transform="rotate(342, 50, 50)"
                    />
                  </svg>
                  
                  {/* Centered label */}
                  <div className="absolute text-center bg-white p-2 rounded-full shadow-inner">
                    <span className="block text-2xl font-black text-slate-900 leading-none">85%</span>
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Affected</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="flex-1 space-y-2.5 text-xs w-full">
                  {[
                    { name: "Leaf Spot", value: "40%", bg: "bg-emerald-800" },
                    { name: "Rust", value: "25%", bg: "bg-emerald-500" },
                    { name: "Blight", value: "20%", bg: "bg-slate-500" },
                    { name: "Powdery Mildew", value: "10%", bg: "bg-slate-300" },
                    { name: "Healthy", value: "15%", bg: "bg-emerald-100" }
                  ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                      <span className="flex items-center gap-2 font-medium text-slate-600">
                        <span className={`w-2.5 h-2.5 rounded-full ${row.bg}`}></span>
                        {row.name}
                      </span>
                      <span className="font-bold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* 4. FIELD PERFORMANCE REPORT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">4. Field Performance Report</h3>
              <Badge className="bg-emerald-50 text-emerald-700 font-bold border-transparent text-xs py-0.5 rounded-md shadow-none">
                Auto-Updating (10 mins ago)
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-4 px-4 rounded-l-xl">Field Name</th>
                    <th className="py-4 px-4">Crop</th>
                    <th className="py-4 px-4 w-[280px]">Health Score</th>
                    <th className="py-4 px-4">Last Scan</th>
                    <th className="py-4 px-4">Risk Level</th>
                    <th className="py-4 px-4 text-center rounded-r-xl w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "North Plot", crop: "Wheat", score: 91, lastScan: "2 days ago", risk: "Low" },
                    { name: "East Plot", crop: "Tomato", score: 63, lastScan: "Today", risk: "High" },
                    { name: "South Plot", crop: "Chili", score: 78, lastScan: "1 day ago", risk: "Medium" },
                    { name: "West Plot", crop: "Cotton", score: 88, lastScan: "3 days ago", risk: "Low" },
                    { name: "Central Plot", crop: "Rice", score: 55, lastScan: "Today", risk: "High" }
                  ].map((row) => (
                    <tr 
                      key={row.name}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-all font-medium text-slate-800"
                    >
                      <td className="py-4 px-4 font-bold text-slate-950">{row.name}</td>
                      <td className="py-4 px-4 text-slate-500 font-semibold">{row.crop}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shrink-0 max-w-[180px]">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                row.score >= 85 ? "bg-green-600" :
                                row.score >= 60 ? "bg-amber-500" :
                                "bg-rose-500 animate-pulse"
                              }`}
                              style={{ width: `${row.score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-slate-900 text-xs shrink-0">{row.score}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-semibold text-xs">{row.lastScan}</td>
                      <td className="py-4 px-4">
                        <span 
                          className={`px-3 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                            row.risk === "Low" ? "bg-green-50 text-green-700 border-green-100" :
                            row.risk === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                            "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                          }`}
                        >
                          {row.risk}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => setSelectedField(FIELD_DETAILS[row.name])}
                          className="w-9 h-9 border border-slate-200 hover:border-green-600 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-xl flex items-center justify-center transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. SCAN HISTORY (RECENT) & 6. WEATHER + DISEASE CORRELATION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Scan History (Recent) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-5">5. Scan History (Recent)</h3>
                
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left text-slate-600 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-3 rounded-l-xl">Image</th>
                        <th className="py-3 px-3">Disease</th>
                        <th className="py-3 px-3">Crop</th>
                        <th className="py-3 px-3">Confidence</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3 rounded-r-xl">Recommended Treatment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { img: "🍂", disease: "Leaf Spot", crop: "Tomato", conf: 92, date: "May 31, 2025", treat: "Copper Fungicide" },
                        { img: "🌾", disease: "Rust", crop: "Wheat", conf: 89, date: "May 30, 2025", treat: "Propiconazole Spray" },
                        { img: "🥔", disease: "Blight", crop: "Potato", conf: 90, date: "May 29, 2025", treat: "Mancozeb Spray" },
                        { img: "🥒", disease: "Powdery Mildew", crop: "Cucumber", conf: 85, date: "May 28, 2025", treat: "Sulfur Dusting" }
                      ].map((row, i) => (
                        <tr 
                          key={i}
                          className="border-b border-slate-50 hover:bg-slate-50/60 font-semibold text-slate-800 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-sm shadow-sm select-none">
                              {row.img}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-950">{row.disease}</td>
                          <td className="py-3 px-3 text-slate-400 font-bold">{row.crop}</td>
                          <td className="py-3 px-3">
                            <Badge className="bg-emerald-50 text-emerald-700 font-bold border-transparent px-2 text-[10px] rounded">
                              {row.conf}%
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-semibold text-[10px] whitespace-nowrap">{row.date}</td>
                          <td className="py-3 px-3 text-emerald-800 font-bold">{row.treat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 flex justify-start">
                <button 
                  onClick={() => router.push("/scanner")}
                  className="text-green-700 hover:text-green-800 text-xs font-bold transition-all flex items-center gap-1 leading-none hover:translate-x-0.5"
                >
                  View All Scans
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Weather + Disease Correlation */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-5">6. Weather + Disease Correlation</h3>
                
                {/* 4 Weather cards */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[
                    { label: "Temperature", val: "28°C", icon: Thermometer, bg: "bg-orange-50 text-orange-600 border-orange-100" },
                    { label: "Humidity", val: "78%", icon: Droplets, bg: "bg-blue-50 text-blue-600 border-blue-100" },
                    { label: "Rainfall", val: "32 mm", icon: CloudRain, bg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                    { label: "Wind Speed", val: "12 km/h", icon: Wind, bg: "bg-teal-50 text-teal-600 border-teal-100" }
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.label} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-center flex flex-col items-center justify-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-1.5 ${card.bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none mb-1">{card.label}</span>
                        <span className="text-xs font-black text-slate-900 leading-none">{card.val}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-slate-900">Disease Cases vs Humidity (%)</span>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-1 bg-slate-700 rounded-full"></span> Disease Cases
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-1 bg-slate-300 rounded-full"></span> Humidity
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative w-full h-[120px] select-none">
                    <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none">
                      <div className="w-full h-px bg-slate-100"></div>
                      <div className="w-full h-px bg-slate-100"></div>
                      <div className="w-full h-px bg-slate-100"></div>
                    </div>

                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                      {/* Humidity Line (light gray) */}
                      <path
                        d="M 10 30 Q 80 50 150 20 T 290 40 T 430 10 T 570 30"
                        fill="transparent"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="4"
                      />

                      {/* Disease Cases Line (dark gray) */}
                      <path
                        d="M 10 90 Q 80 70 150 80 T 290 60 T 430 50 T 570 70"
                        fill="transparent"
                        stroke="#334155"
                        strokeWidth="2.5"
                      />

                      {/* Points */}
                      {[10, 150, 290, 430, 570].map((cx, i) => (
                        <g key={i}>
                          <circle cx={cx} cy="80" r="3.5" fill="#334155" />
                        </g>
                      ))}
                    </svg>

                    {/* X Axis */}
                    <div className="absolute inset-x-0 -bottom-5 flex justify-between text-[8px] font-bold text-slate-400">
                      <span>May 1</span>
                      <span>May 8</span>
                      <span>May 15</span>
                      <span>May 22</span>
                      <span>May 29</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 7. YIELD PREDICTION / RISK ANALYSIS & 8. DOWNLOADABLE REPORTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Yield Prediction / Risk Analysis */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-5">7. Yield Prediction / Risk Analysis</h3>

              <div className="flex flex-col md:flex-row items-center gap-6 h-full">
                
                {/* Outbreak spread gauge */}
                <div className="flex items-center gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl md:max-w-xs w-full">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="text-slate-100 stroke-current"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        className="text-rose-500 stroke-current animate-pulse"
                        strokeWidth="8"
                        strokeDasharray="238.7"
                        strokeDashoffset="66.8" // 72% filled (238.7 * 0.28 = 66.8 offset)
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="block text-xl font-black text-rose-600">72%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">North Plot – Wheat</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Risk of disease spread</span>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">72% vulnerability threshold reached within next 7 days.</p>
                    <Button 
                      onClick={() => setSelectedField(FIELD_DETAILS["North Plot"])}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg px-3 py-1 h-7 flex items-center gap-1 shadow-sm mt-1"
                    >
                      View Details
                    </Button>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                  
                  {/* Yield Prediction */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between h-[110px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Yield</span>
                    <div>
                      <span className="text-xl font-extrabold text-slate-900 block leading-tight">3.2 t/ha</span>
                      <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5 mt-0.5">
                        ▼ 8% from last season
                      </span>
                    </div>
                  </div>

                  {/* Potential Loss */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between h-[110px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Potential Loss</span>
                    <div>
                      <span className="text-xl font-extrabold text-slate-900 block leading-tight">0.6 t/ha</span>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">If no action taken</span>
                    </div>
                  </div>

                  {/* Action Urgency */}
                  <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-4 flex flex-col justify-between h-[110px] animate-pulse">
                    <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider block">Action Urgency</span>
                    <div>
                      <span className="text-xl font-extrabold text-rose-700 block leading-tight">High</span>
                      <span className="text-[9px] text-rose-500 font-bold block mt-0.5">Take action soon</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Right: Downloadable Reports */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-5">8. Downloadable Reports</h3>

              <div className="grid grid-cols-2 gap-3 w-full h-full">
                
                {/* Export PDF */}
                <button 
                  onClick={() => handleExport("PDF")}
                  className="bg-slate-50 hover:bg-green-50 border border-slate-150 hover:border-green-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-green-100/50 text-slate-500 group-hover:text-green-700 border border-slate-100 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs block">Export PDF</span>
                </button>

                {/* Export CSV */}
                <button 
                  onClick={() => handleExport("CSV")}
                  className="bg-slate-50 hover:bg-green-50 border border-slate-150 hover:border-green-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-green-100/50 text-slate-500 group-hover:text-green-700 border border-slate-100 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-colors">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs block">Export CSV</span>
                </button>

                {/* Share Report */}
                <button 
                  onClick={() => handleExport("Share")}
                  className="bg-slate-50 hover:bg-green-50 border border-slate-150 hover:border-green-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-green-100/50 text-slate-500 group-hover:text-green-700 border border-slate-100 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-colors">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs block">Share Report</span>
                </button>

                {/* Print Summary */}
                <button 
                  onClick={() => handleExport("Print")}
                  className="bg-slate-50 hover:bg-green-50 border border-slate-150 hover:border-green-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-green-100/50 text-slate-500 group-hover:text-green-700 border border-slate-100 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-colors">
                    <Printer className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs block">Print Summary</span>
                </button>

              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
