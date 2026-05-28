"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  BookOpen,
  TrendingUp,
  Map,
  LogOut,
  LifeBuoy,
  Search,
  Bell,
  Settings,
  Upload,
  Camera,
  Activity,
  MapPin,
  Thermometer,
  Droplet,
  Compass,
  Wind,
  CheckCircle,
  AlertTriangle,
  Target,
  Sparkles,
  ArrowRight,
  Shield,
  Plus,
  Loader2,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [scans, setScans] = useState<any[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  // Fetch scans from database
  const fetchScans = async () => {
    try {
      const response = await fetch("/api/scans");
      if (response.ok) {
        const data = await response.json();
        setScans(data.scans || []);
      }
    } catch (error) {
      console.error("Error fetching scans:", error);
    } finally {
      setLoadingScans(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process File Upload and Trigger AI Scan
  const processFile = async (file: File) => {
    setUploadedFile(file);
    setScanning(true);
    setScanProgress(10);
    setScanResult(null);

    // Simulate analysis step progress for premium UX feeling
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("farmer_id", "demo-farmer");
      formData.append("crop_type", "Unknown");

      const response = await fetch("/api/scans", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setScanProgress(100);

      if (response.ok) {
        const result = await response.json();
        setTimeout(() => {
          setScanResult(result);
          setScanning(false);
          fetchScans(); // Refresh table
        }, 600);
      } else {
        const errText = await response.text();
        throw new Error(errText || "Scanning failed");
      }
    } catch (err) {
      console.error(err);
      alert("Scan failed. Ensure the backend ML service is running or try again.");
      setScanning(false);
    }
  };

  // Mock initial scans matching mockup if DB is empty
  const displayScans = scans.length > 0 ? scans.slice(0, 5) : [
    {
      scan_id: "SCN-9021",
      crop_type: "Tomato Leaf",
      disease_name: "Early Blight",
      status: "AT RISK",
      severity: "High",
      scanned_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      location: "Sector 4-B"
    },
    {
      scan_id: "SCN-8994",
      crop_type: "Corn Leaf",
      disease_name: "Healthy",
      status: "OPTIMAL",
      severity: "None",
      scanned_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      location: "West Ridge"
    }
  ];

  // Dynamic statistics from database scans
  const totalScansCount = scans.length;

  const healthyCropsCount = scans.filter(scan => {
    const isHealthy = (scan.disease_name || "").toLowerCase().includes("healthy") || 
                      (scan.status || "").toLowerCase() === "optimal" ||
                      (scan.severity || "").toLowerCase() === "none";
    return isHealthy;
  }).length;

  const diseasedCropsCount = totalScansCount - healthyCropsCount;

  const healthyPercentage = totalScansCount > 0 ? Math.round((healthyCropsCount / totalScansCount) * 100) : 0;
  const diseasedPercentage = totalScansCount > 0 ? Math.round((diseasedCropsCount / totalScansCount) * 100) : 0;
  
  // Average confidence as accuracy
  const averageConfidence = totalScansCount > 0 
    ? Math.round((scans.reduce((sum, scan) => sum + Number(scan.confidence_score || 0), 0) / totalScansCount) * 100) 
    : 98.2;

  // Dynamic crop distribution based on scans
  const distributionColors = [
    { text: "text-emerald-800", bg: "bg-emerald-800", hex: "#064e3b" },
    { text: "text-emerald-600", bg: "bg-emerald-600", hex: "#059669" },
    { text: "text-slate-600",   bg: "bg-slate-600",   hex: "#475569" },
    { text: "text-slate-400",   bg: "bg-slate-400",   hex: "#94a3b8" },
    { text: "text-slate-300",   bg: "bg-slate-300",   hex: "#cbd5e1" },
  ];

  const activeScans = scans.length > 0 ? scans : displayScans;
  const cropCounts: { [key: string]: number } = {};
  
  activeScans.forEach(scan => {
    let crop = scan.crop_type || "Unknown";
    crop = crop.replace(/\s+Leaf$/i, "");
    cropCounts[crop] = (cropCounts[crop] || 0) + 1;
  });

  const totalCropsCount = activeScans.length;
  
  const rawDistribution = Object.keys(cropCounts).map(crop => {
    const count = cropCounts[crop];
    const percentage = totalCropsCount > 0 ? (count / totalCropsCount) * 100 : 0;
    return { crop, count, percentage };
  }).sort((a, b) => b.count - a.count);

  let topCrops = rawDistribution;
  if (rawDistribution.length > 4) {
    topCrops = rawDistribution.slice(0, 3);
    const others = rawDistribution.slice(3);
    const otherCount = others.reduce((sum, item) => sum + item.count, 0);
    const otherPercentage = others.reduce((sum, item) => sum + item.percentage, 0);
    topCrops.push({
      crop: "Other",
      count: otherCount,
      percentage: otherPercentage
    });
  }

  const circumference = 238.76;
  let cumulativePercentage = 0;
  
  const cropSegments = topCrops.map((item, index) => {
    const roundedPercentage = Math.round(item.percentage);
    const strokeDashoffset = circumference * (1 - item.percentage / 100);
    const rotationAngle = cumulativePercentage * 3.6;
    cumulativePercentage += item.percentage;
    
    const colorObj = distributionColors[index] || { text: "text-slate-200", bg: "bg-slate-200", hex: "#cbd5e1" };
    
    return {
      crop: item.crop,
      count: item.count,
      percentage: roundedPercentage,
      strokeDashoffset,
      rotationAngle,
      color: colorObj
    };
  });

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        {/* SCROLLABLE MAIN BODY */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-8">
          
          {/* 1. HERO HERO BANNER CARD */}
          <div className="relative bg-emerald-950 rounded-3xl overflow-hidden min-h-[360px] shadow-xl shadow-emerald-950/10 border border-emerald-900/40 flex items-center">
            {/* Background Image with Green Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" 
              style={{ backgroundImage: `url('/dashboard_hero_bg.png')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent z-0" />
            
            <div className="relative z-10 p-10 md:p-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Text Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 border border-emerald-600/40 rounded-full text-emerald-400 text-xs font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Precision Engine Active
                </div>
                
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
                  Diagnose Crop Diseases & <span className="text-[#52b788] italic font-serif">Optimize Field Yields</span>
                </h2>
                
                <p className="text-emerald-200/80 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                  Instantly scan crop samples to identify leaf pathogens, track environmental conditions, and access actionable treatments to secure your harvest.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button 
                    onClick={() => router.push("/scanner")}
                    className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white border-0 font-bold px-6 py-5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all text-sm h-auto"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Start Scan
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-100 text-emerald-900 font-bold px-6 py-5 rounded-xl border border-white transition-all text-sm h-auto flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-800" />
                    Upload Image
                  </Button>
                </div>
              </div>

              {/* Graphical Circular Indicator Right Column */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-56 h-56 rounded-full bg-emerald-900/30 border border-emerald-800/30 backdrop-blur-md flex items-center justify-center p-4">
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-pulse"></div>
                  
                  {/* SVG Circle Progress */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="5"
                      cy="5"
                      r="40"
                      className="text-emerald-900/40 stroke-current"
                      strokeWidth="6"
                      fill="transparent"
                      transform="translate(45, 45)"
                    />
                    {/* Animated Progress Circle */}
                    <circle
                      cx="5"
                      cy="5"
                      r="40"
                      className="text-[#52b788] stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="6"
                      strokeDasharray="251.2"
                      strokeDashoffset="45.2" // 82% of 251.2 is 206, so offset is 45.2
                      strokeLinecap="round"
                      fill="transparent"
                      transform="translate(45, 45)"
                    />
                  </svg>

                  {/* Centered Text */}
                  <div className="absolute text-center space-y-1">
                    <span className="block text-4xl md:text-5xl font-black text-white tracking-tight">82%</span>
                    <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider leading-none">Optimal Health</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. STATS ROW (4 WIDGETS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Widget 1: Total Scans */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-700 font-bold border-transparent px-2.5 py-1 text-[11px] rounded-full">
                  Live DB Feed
                </Badge>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Scans</span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalScansCount}</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-50">
                <div className="h-full bg-emerald-400/40 w-full"></div>
              </div>
            </div>

            {/* Widget 2: Healthy Crops */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-700 font-bold border-transparent px-2.5 py-1 text-[11px] rounded-full">
                  {totalScansCount > 0 ? `${healthyPercentage}% Stability` : '100% Stability'}
                </Badge>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Healthy Crops</span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{healthyCropsCount}</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-50">
                <div className="h-full bg-emerald-600" style={{ width: `${totalScansCount > 0 ? healthyPercentage : 100}%` }}></div>
              </div>
            </div>

            {/* Widget 3: Diseases Detected */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <Badge className="bg-rose-50 hover:bg-rose-50 text-rose-700 font-bold border-transparent px-2.5 py-1 text-[11px] rounded-full">
                  {totalScansCount > 0 ? `${diseasedPercentage}% Alert` : '0% Alert'}
                </Badge>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Diseases Detected</span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{diseasedCropsCount}</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-rose-50">
                <div className="h-full bg-rose-500" style={{ width: `${totalScansCount > 0 ? diseasedPercentage : 0}%` }}></div>
              </div>
            </div>

            {/* Widget 4: AI Accuracy */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                  <Target className="w-5 h-5" />
                </div>
                <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-700 font-bold border-transparent px-2.5 py-1 text-[11px] rounded-full">
                  {averageConfidence}% Acc
                </Badge>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1">AI Accuracy</span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{averageConfidence}%</h3>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
                <div className="h-full bg-slate-800" style={{ width: `${averageConfidence}%` }}></div>
              </div>
            </div>

          </div>

          {/* 3. MAIN WIDGETS LAYOUT GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN - SCANNER AND CHARTS */}
            <div className="xl:col-span-2 space-y-8 flex flex-col min-w-0">
              
              {/* WIDGET A: QUICK FIELD SCAN */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-950">Quick Field Scan</h3>
                    <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-700 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-transparent rounded-full flex gap-1 items-center">
                      <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                      HD Sensor: Ready
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold uppercase px-2.5 py-1 rounded-full border border-slate-150">
                      LIDAR: Active
                    </span>
                  </div>
                </div>

                {/* Dropzone Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive 
                      ? "border-emerald-600 bg-emerald-50/20" 
                      : "border-slate-200 hover:border-emerald-500 hover:bg-slate-50/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {scanning ? (
                    <div className="space-y-4 py-4 w-full max-w-[280px]">
                      <div className="flex justify-center">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-slate-900">AI Plant Analysis Active...</p>
                        <p className="text-xs text-slate-500">Scanning cellular crop data</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : scanResult ? (
                    <div className="space-y-4 py-2 w-full">
                      <div className="flex justify-center">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="font-extrabold text-slate-900 text-lg leading-tight">
                          {scanResult.disease === "Healthy" ? "Healthy Crop Identified" : `${scanResult.disease} Detected`}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{scanResult.description}</p>
                      </div>
                      <div className="flex justify-center gap-3">
                        <Badge className="bg-emerald-600 text-white border-transparent px-3 py-1 font-bold text-xs">
                          {Math.round(scanResult.confidence)}% Confidence
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-700 border-transparent px-3 py-1 font-bold text-xs">
                          Severity: {scanResult.severity}
                        </Badge>
                      </div>
                      <div className="pt-2 flex justify-center gap-2">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setScanResult(null);
                            setUploadedFile(null);
                          }}
                          variant="outline"
                          className="h-9 px-4 rounded-lg text-xs font-semibold border-slate-200"
                        >
                          Scan Again
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/scanner");
                          }}
                          className="h-9 px-4 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                        >
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100/50">
                        <Camera className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">Drag crop samples here</h4>
                      <p className="text-xs text-slate-400 mb-6">or click to browse local files (JPG, PNG, HEIC)</p>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        variant="outline"
                        className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-xl px-5 h-10 text-xs flex items-center gap-2 shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-emerald-600" />
                        Add New Scan
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* TWO SMALL CHARTS SIDE-BY-SIDE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* WIDGET B: GROWTH TRENDS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">Growth Trends</h3>
                  </div>
                  
                  {scans.length < 10 ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] text-center p-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-3 border border-amber-100/50">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Insufficient Data</h4>
                      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                        Weekly historical data is insufficient. Please perform at least 10 scans to generate trend models.
                      </p>
                    </div>
                  ) : (
                    /* SVG Bar Chart with hover states */
                    <div className="flex-1 flex flex-col justify-end min-h-[180px]">
                      <div className="flex items-end justify-between gap-2 h-36 px-2">
                        {/* Mon: 40% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#e8f5e9] hover:bg-emerald-200 rounded-lg transition-all duration-300 relative h-[40%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">40</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">MON</span>
                        </div>
                        {/* Tue: 65% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#c8e6c9] hover:bg-emerald-300 rounded-lg transition-all duration-300 relative h-[65%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">65</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">TUE</span>
                        </div>
                        {/* Wed: 50% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#e8f5e9] hover:bg-emerald-200 rounded-lg transition-all duration-300 relative h-[50%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">50</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">WED</span>
                        </div>
                        {/* Thu: 85% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#a1d99b] hover:bg-emerald-400 rounded-lg transition-all duration-300 relative h-[85%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">85</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">THU</span>
                        </div>
                        {/* Fri: 70% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#c8e6c9] hover:bg-emerald-300 rounded-lg transition-all duration-300 relative h-[70%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">70</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">FRI</span>
                        </div>
                        {/* Sat: 95% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#1b4332] rounded-lg transition-all duration-300 relative h-[95%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">95</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">SAT</span>
                        </div>
                        {/* Sun: 30% */}
                        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="w-full bg-[#e8f5e9] hover:bg-emerald-200 rounded-lg transition-all duration-300 relative h-[30%]">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">30</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">SUN</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* WIDGET C: CROP DISTRIBUTION */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">Crop Distribution</h3>
                  </div>

                  {/* Donut Chart Rendering */}
                  <div className="flex-1 flex flex-col items-center justify-center relative min-h-[180px]">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {cropSegments.map((seg, idx) => (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="38"
                            className={`${seg.color.text} stroke-current`}
                            strokeWidth="10"
                            strokeDasharray="238.76"
                            strokeDashoffset={seg.strokeDashoffset}
                            fill="transparent"
                            transform={`rotate(${seg.rotationAngle}, 50, 50)`}
                          />
                        ))}
                      </svg>
                      {/* Centered label */}
                      <div className="absolute text-center">
                        <span className="block text-2xl font-black text-slate-950">
                          {cropSegments.length > 0 ? `${cropSegments[0].percentage}%` : "0%"}
                        </span>
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                          {cropSegments.length > 0 ? cropSegments[0].crop : "None"}
                        </span>
                      </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 text-xs justify-center w-full">
                      {cropSegments.map((seg, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <span className={`w-2.5 h-2.5 rounded-full ${seg.color.bg}`}></span> {seg.crop} ({seg.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* WIDGET D: RECENT FIELD SCANS */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-950">Recent Field Scans</h3>
                  <Link href="/scanner" className="text-emerald-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1">
                    View Full Registry
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                        <th className="py-4 px-4">Scan ID</th>
                        <th className="py-4 px-4">Location</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayScans.map((row, i) => (
                        <tr 
                          key={row.scan_id || i} 
                          onClick={() => router.push("/scanner")}
                          className="border-b border-slate-50 hover:bg-slate-50/60 cursor-pointer transition-all"
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            #{row.scan_id ? String(row.scan_id).substring(0, 8).toUpperCase() : `SCN-00${i}`}
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">{row.location || row.crop_type || "Main Ridge"}</td>
                          <td className="py-4 px-4">
                            <span 
                              className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                                row.severity?.toLowerCase() === "none" || row.disease_name?.toLowerCase() === "healthy"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              }`}
                            >
                              {row.severity?.toLowerCase() === "none" || row.disease_name?.toLowerCase() === "healthy" ? "OPTIMAL" : "AT RISK"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-semibold text-xs">
                            {(() => {
                              try {
                                const diff = Date.now() - new Date(row.scanned_at).getTime();
                                const mins = Math.floor(diff / 60000);
                                if (mins < 1) return "Just now";
                                if (mins < 60) return `${mins} mins ago`;
                                const hrs = Math.floor(mins / 60);
                                if (hrs < 24) return `${hrs} hours ago`;
                                return new Date(row.scanned_at).toLocaleDateString();
                              } catch {
                                return "2 mins ago";
                              }
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - CONDITIONS, AI RECS, TIMELINE */}
            <div className="xl:col-span-1 space-y-8">
              
              {/* WIDGET E: FARM CONDITIONS */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                {/* Background Accent glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-start justify-between mb-6 relative">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 leading-none mb-1">Farm Conditions</h3>
                    <span className="text-xs text-slate-400 font-semibold">Valley Estate, Zone 9</span>
                  </div>
                  {/* Sun Cloud Icon */}
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Wind className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Humidity: 64% */}
                  <div className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Humidity</span>
                    <span className="text-xl font-extrabold text-slate-900 block">64%</span>
                  </div>
                  {/* Temperature: 36C */}
                  <div className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Temperature</span>
                    <span className="text-xl font-extrabold text-slate-900 block">36°C</span>
                  </div>
                  {/* Soil pH: 6.8 */}
                  <div className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Soil pH</span>
                    <span className="text-xl font-extrabold text-slate-900 block">6.8</span>
                  </div>
                  {/* Moisture: 18% */}
                  <div className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Moisture</span>
                    <span className="text-xl font-extrabold text-slate-900 block">18%</span>
                  </div>
                </div>
              </div>

              {/* WIDGET F: AI RECOMMENDATIONS */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <h3 className="text-xs text-emerald-700 font-bold uppercase tracking-widest mb-6">AI Recommendations</h3>

                <div className="space-y-4">
                  {/* Irrigation Alert */}
                  <div className="border border-emerald-100/60 rounded-2xl p-4 bg-emerald-50/10 flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Droplet className="w-4 h-4 text-emerald-700 fill-emerald-100" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Irrigation Alert</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Sector 4-B shows early signs of moisture stress. Recommended cycle: 15 mins at 22:00.
                      </p>
                      <button 
                        onClick={() => alert("Executing scheduled irrigation cycle for Sector 4-B...")}
                        className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 transition-all flex items-center gap-0.5 uppercase tracking-wider"
                      >
                        Execute Now &gt;
                      </button>
                    </div>
                  </div>

                  {/* Pest Detected */}
                  <div className="border border-rose-100 rounded-2xl p-4 bg-rose-50/10 flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Pest Detected</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        AI identifies Aphid cluster in West Ridge (96% confidence). Targeted spraying required.
                      </p>
                      <button 
                        onClick={() => router.push("/field-management")}
                        className="text-[10px] font-extrabold text-rose-700 hover:text-rose-850 transition-all flex items-center gap-0.5 uppercase tracking-wider"
                      >
                        View Map &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET G: ACTIVITY TIMELINE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative flex flex-col justify-between">
                <h3 className="text-lg font-bold text-slate-950 mb-6">Activity Timeline</h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {/* Timeline Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-1 ring-emerald-200"></span>
                    <h4 className="font-bold text-sm text-slate-900 leading-none">Drone Alpha Return</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Today, 11:45 AM • Field B</span>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm ring-1 ring-slate-100"></span>
                    <h4 className="font-bold text-sm text-slate-900 leading-none">Weekly Report Generated</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Today, 08:00 AM • Automated System</span>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm ring-1 ring-slate-100"></span>
                    <h4 className="font-bold text-sm text-slate-900 leading-none">Sensor Node #24 Online</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Yesterday, 10:20 PM • South Gate</span>
                  </div>
                </div>

                {/* Floating Action Add Button at bottom right */}
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => router.push("/scanner")}
                    className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center shadow-lg hover:bg-emerald-900 transition-all transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
