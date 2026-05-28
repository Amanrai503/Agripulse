"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import {
  User,
  Cpu,
  Sprout,
  Bell,
  Link2,
  CheckCircle2,
  Save,
  RotateCcw,
  Sliders,
  Shield,
  Activity,
  Check,
  Languages,
  Smartphone,
  Eye,
  Settings,
  HardDrive,
  CloudSun,
  FlameKindling
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Definition of default settings
const DEFAULT_PROFILE = {
  name: "Dr. Smith",
  email: "dr.smith@agripulse.ai",
  phone: "+91 98765 43210",
  farmName: "Green Valley Farms",
  location: "Sector 4-B, Punjab",
  language: "English (US)"
};

const DEFAULT_AI = {
  confidenceThreshold: 85,
  autoDiagnose: true,
  alertLevel: "all", // "all" | "critical" | "none"
  scanFrequency: "Daily" // "Daily" | "Weekly" | "Manual"
};

const DEFAULT_FARM = {
  defaultCrop: "Wheat",
  unitSystem: "hectares", // "hectares" | "acres"
  irrigationThreshold: 35 // moisture percentage
};

const DEFAULT_NOTIF = {
  pushEnabled: true,
  emailReports: "Weekly", // "Daily" | "Weekly" | "Monthly" | "Off"
  smsAlerts: true
};

const DEFAULT_INTEGRATION = {
  droneAlphaDocking: true,
  iotNode24: true,
  iotNode18: false,
  weatherStationAPI: "Connected"
};

export default function SettingsPage() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "farm" | "notifications" | "integrations">("profile");

  // Form states
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [ai, setAi] = useState(DEFAULT_AI);
  const [farm, setFarm] = useState(DEFAULT_FARM);
  const [notif, setNotif] = useState(DEFAULT_NOTIF);
  const [integration, setIntegration] = useState(DEFAULT_INTEGRATION);

  // Success alert state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Settings saved successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset current tab to default system settings?")) {
      if (activeTab === "profile") setProfile(DEFAULT_PROFILE);
      if (activeTab === "ai") setAi(DEFAULT_AI);
      if (activeTab === "farm") setFarm(DEFAULT_FARM);
      if (activeTab === "notifications") setNotif(DEFAULT_NOTIF);
      if (activeTab === "integrations") setIntegration(DEFAULT_INTEGRATION);

      setToastMessage("Tab reset to default system settings.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Nav Item list
  const tabItems = [
    { id: "profile", name: "General Profile", icon: User, desc: "Manage your farm credentials & info" },
    { id: "ai", name: "AI Diagnostics", icon: Cpu, desc: "Adjust confidence thresholds & scan modes" },
    { id: "farm", name: "Farm Systems", icon: Sprout, desc: "Configure units, crops, & soil parameters" },
    { id: "notifications", name: "Notifications", icon: Bell, desc: "Manage push alerts & weekly analytics" },
    { id: "integrations", name: "IoT & Hardware", icon: Link2, desc: "Connect drone docks & sensor nodes" }
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        {/* Dynamic Head Meta details inside semantic layout */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto relative">
          
          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-6 duration-300">
              <div className="bg-slate-900 text-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3 border border-slate-800">
                <div className="bg-emerald-500/10 p-1 rounded-full text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">{toastMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">System Settings</h2>
              <p className="text-gray-500 text-sm max-w-2xl">
                Configure your AgriPulse analytics dashboard, threshold controls, AI algorithms, and connected IoT drone fleet.
              </p>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 shadow-sm rounded-full font-medium">
                <Sliders className="w-4 h-4 mr-1.5 text-green-600 animate-spin" style={{ animationDuration: "12s" }} />
                AgriPulse Engine v2.4
              </Badge>
            </div>
          </div>

          {/* Settings Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Left Tabs Column */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {tabItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`settings-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border duration-200 flex items-start gap-4 ${
                      isActive
                        ? "bg-white border-slate-100 shadow-md shadow-slate-100/40 text-emerald-950 translate-x-1"
                        : "bg-transparent border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${
                      isActive 
                        ? "bg-green-50 text-green-700 border-green-100 shadow-sm"
                        : "bg-slate-100/50 text-slate-400 border-slate-100"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{item.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Status Monitor Card */}
              <Card className="border border-slate-100 bg-white shadow-sm mt-4 p-5 rounded-2xl">
                <CardHeader className="p-0 mb-4 flex-row items-center gap-3">
                  <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">System Telemetry</CardTitle>
                    <CardDescription className="text-[10px] text-slate-400">Live operational indicators</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">IoT Sensor Node Array</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      94% Health
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Drone Alpha Battery</span>
                    <span className="text-slate-800 font-bold">89% Charged</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">ML Diagnostics API</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-medium">Cloud Database Sync</span>
                    <span className="text-slate-400 font-semibold">5 mins ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Form Card Column */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                
                {/* 1. General Profile Panel */}
                {activeTab === "profile" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-5">
                      <h3 className="text-xl font-bold text-slate-900">General Profile Settings</h3>
                      <p className="text-xs text-slate-400 mt-1">Update your farming identity, credential keys, and geographical coordinates.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label htmlFor="profile-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                        <input
                          id="profile-name"
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="profile-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                        <input
                          id="profile-email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="profile-phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                        <input
                          id="profile-phone"
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="profile-farm" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Farm Registry Name</label>
                        <input
                          id="profile-farm"
                          type="text"
                          value={profile.farmName}
                          onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="profile-loc" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Geographical Region/Zone</label>
                        <input
                          id="profile-loc"
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="profile-lang" className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-slate-400" />
                          System Language
                        </label>
                        <select
                          id="profile-lang"
                          value={profile.language}
                          onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                          className="w-full border border-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        >
                          <option value="English (US)">English (US)</option>
                          <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                          <option value="Spanish (Español)">Spanish (Español)</option>
                          <option value="Punjabi (ਪੰਜਾਬੀ)">Punjabi (ਪੰਜਾਬੀ)</option>
                          <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AI & Diagnostics Panel */}
                {activeTab === "ai" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-5">
                      <h3 className="text-xl font-bold text-slate-900">AI Diagnostics Settings</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure parameters for our proprietary spectral machine learning algorithms.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Slider: Confidence threshold */}
                      <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">ML Confidence Threshold</span>
                            <span className="text-[10px] text-slate-400 font-semibold block">Minimum confidence level required for AI to display diagnostic alerts.</span>
                          </div>
                          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-sm px-2.5 py-0.5 rounded-lg border-transparent">
                            {ai.confidenceThreshold}%
                          </Badge>
                        </div>
                        <input 
                          type="range"
                          min="50"
                          max="98"
                          value={ai.confidenceThreshold}
                          onChange={(e) => setAi({ ...ai, confidenceThreshold: Number(e.target.value) })}
                          className="w-full accent-green-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>50% (SENSITIVE)</span>
                          <span>75% (BALANCED)</span>
                          <span>98% (STRICT)</span>
                        </div>
                      </div>

                      {/* Toggle: Auto Scan */}
                      <div className="flex items-center justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label htmlFor="ai-autoscan" className="text-sm font-bold text-slate-800 block">Instant AI Upload Diagnosis</label>
                          <span className="text-[11px] text-slate-400 font-semibold block">Automatically run neural cell classification scanning the moment a leaf image is uploaded.</span>
                        </div>
                        <button
                          id="ai-autoscan"
                          type="button"
                          onClick={() => setAi({ ...ai, autoDiagnose: !ai.autoDiagnose })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            ai.autoDiagnose ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                          }`}
                        >
                          <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transform transition-all duration-300"></span>
                        </button>
                      </div>

                      {/* Select alert levels */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label htmlFor="ai-alerts" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Foliar Disease Severity Alerts</label>
                          <select
                            id="ai-alerts"
                            value={ai.alertLevel}
                            onChange={(e) => setAi({ ...ai, alertLevel: e.target.value })}
                            className="w-full border border-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          >
                            <option value="all">Notify on All Detections</option>
                            <option value="critical">Notify on Critical/Severe Only</option>
                            <option value="none">Suppress Foliar Warnings</option>
                          </select>
                        </div>

                        {/* Scan frequency */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Automated Field Drone Frequency</label>
                          <div className="flex gap-2">
                            {["Daily", "Weekly", "Manual"].map((freq) => (
                              <button
                                key={freq}
                                type="button"
                                onClick={() => setAi({ ...ai, scanFrequency: freq })}
                                className={`flex-1 py-2 px-3 border rounded-xl font-bold text-xs transition-all ${
                                  ai.scanFrequency === freq
                                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Farm Systems Panel */}
                {activeTab === "farm" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-5">
                      <h3 className="text-xl font-bold text-slate-900">Farm Systems & Irrigation Settings</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure automated parameters for geographical planning and soil systems.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Units system */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Standard Measurement Unit</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setFarm({ ...farm, unitSystem: "hectares" })}
                              className={`flex-1 py-2.5 px-4 border rounded-xl font-bold text-sm transition-all ${
                                farm.unitSystem === "hectares"
                                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Metric (Hectares, m²)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFarm({ ...farm, unitSystem: "acres" })}
                              className={`flex-1 py-2.5 px-4 border rounded-xl font-bold text-sm transition-all ${
                                farm.unitSystem === "acres"
                                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Imperial (Acres, sq ft)
                            </button>
                          </div>
                        </div>

                        {/* Default crop */}
                        <div className="space-y-1.5">
                          <label htmlFor="farm-crop" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Primary Crop Category</label>
                          <select
                            id="farm-crop"
                            value={farm.defaultCrop}
                            onChange={(e) => setFarm({ ...farm, defaultCrop: e.target.value })}
                            className="w-full border border-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          >
                            <option value="Wheat">Wheat (Kanak)</option>
                            <option value="Tomato">Tomato (Tamatar)</option>
                            <option value="Corn">Corn (Makki)</option>
                            <option value="Potato">Potato (Aloo)</option>
                            <option value="Grapes">Grapes (Angoor)</option>
                          </select>
                        </div>
                      </div>

                      {/* Moisture sensor threshold slider */}
                      <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Auto-Irrigation Soil Threshold</span>
                            <span className="text-[10px] text-slate-400 font-semibold block">Triggers smart drip system when moisture drops below this value.</span>
                          </div>
                          <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-bold text-sm px-2.5 py-0.5 rounded-lg border-transparent">
                            {farm.irrigationThreshold}% Moisture
                          </Badge>
                        </div>
                        <input 
                          type="range"
                          min="15"
                          max="60"
                          value={farm.irrigationThreshold}
                          onChange={(e) => setFarm({ ...farm, irrigationThreshold: Number(e.target.value) })}
                          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>15% (DRY SAND)</span>
                          <span>35% (OPTIMAL GRAIN)</span>
                          <span>60% (WET CLAY)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Notifications Panel */}
                {activeTab === "notifications" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-5">
                      <h3 className="text-xl font-bold text-slate-900">Notification & Alert Settings</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure warning channels for immediate outbreak protection.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Push alerts */}
                      <div className="flex items-center justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label htmlFor="notif-push" className="text-sm font-bold text-slate-800 block">System Browser Push Alerts</label>
                          <span className="text-[11px] text-slate-400 font-semibold block">Receive high-priority desktop warnings immediately when local sensors trigger alerts.</span>
                        </div>
                        <button
                          id="notif-push"
                          type="button"
                          onClick={() => setNotif({ ...notif, pushEnabled: !notif.pushEnabled })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            notif.pushEnabled ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                          }`}
                        >
                          <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transform transition-all duration-300"></span>
                        </button>
                      </div>

                      {/* SMS alerts */}
                      <div className="flex items-center justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label htmlFor="notif-sms" className="text-sm font-bold text-slate-800 block">SMS Critical Outbreak Alerts</label>
                          <span className="text-[11px] text-slate-400 font-semibold block">Transmit direct mobile text warnings instantly when contagious pathogenetic spores are detected.</span>
                        </div>
                        <button
                          id="notif-sms"
                          type="button"
                          onClick={() => setNotif({ ...notif, smsAlerts: !notif.smsAlerts })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            notif.smsAlerts ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                          }`}
                        >
                          <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transform transition-all duration-300"></span>
                        </button>
                      </div>

                      {/* Email analytics frequency */}
                      <div className="space-y-1.5">
                        <label htmlFor="notif-reports" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Analytical Yield & Outbreak Summary Reports</label>
                        <select
                          id="notif-reports"
                          value={notif.emailReports}
                          onChange={(e) => setNotif({ ...notif, emailReports: e.target.value })}
                          className="w-full border border-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        >
                          <option value="Daily">Daily Outbreak Registers</option>
                          <option value="Weekly">Weekly Farm Summary Reports</option>
                          <option value="Monthly">Monthly Agronomic Insights</option>
                          <option value="Off">Disable Email Digests</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Integrations Panel */}
                {activeTab === "integrations" && (
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-5">
                      <h3 className="text-xl font-bold text-slate-900">Connected IoT Hardware & Integrations</h3>
                      <p className="text-xs text-slate-400 mt-1">Connect physical smart hardware, aerial telemetry drones, and satellite APIs.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Weather API Node */}
                      <div className="flex items-center justify-between bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100/50">
                            <CloudSun className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-800 block">OpenWeather Map API</span>
                            <span className="text-[10px] text-slate-400 font-semibold block">Providing solar index and ambient moisture forecasts.</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 font-bold border-transparent px-2.5 py-1 text-xs">
                          {integration.weatherStationAPI}
                        </Badge>
                      </div>

                      {/* Drone auto docking */}
                      <div className="flex items-center justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5 max-w-[80%]">
                          <label htmlFor="int-drone" className="text-sm font-bold text-slate-800 block">Drone Alpha Automatic Outbreak Docking</label>
                          <span className="text-[11px] text-slate-400 font-semibold block">Automatically dispatch Drone Alpha to capture HD foliar closeups upon detecting at-risk sensor nodes.</span>
                        </div>
                        <button
                          id="int-drone"
                          type="button"
                          onClick={() => setIntegration({ ...integration, droneAlphaDocking: !integration.droneAlphaDocking })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center outline-none ${
                            integration.droneAlphaDocking ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                          }`}
                        >
                          <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transform transition-all duration-300"></span>
                        </button>
                      </div>

                      {/* IoT Nodes array */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Physical Soil Sensor Nodes</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Node #24 */}
                          <div className="border border-slate-100 bg-slate-50/20 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <HardDrive className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">Sensor Node #24</span>
                                <span className="text-[9px] text-slate-400">West Ridge Array</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIntegration({ ...integration, iotNode24: !integration.iotNode24 })}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                integration.iotNode24 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {integration.iotNode24 ? "ENABLED" : "MUTED"}
                            </button>
                          </div>

                          {/* Node #18 */}
                          <div className="border border-slate-100 bg-slate-50/20 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                <HardDrive className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">Sensor Node #18</span>
                                <span className="text-[9px] text-slate-400">Sector 4-B Array</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIntegration({ ...integration, iotNode18: !integration.iotNode18 })}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                integration.iotNode18 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {integration.iotNode18 ? "ENABLED" : "MUTED"}
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Action Footer */}
                <div className="bg-slate-50/80 border-t border-slate-100 p-6 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5 leading-none">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Secure configuration: 256-bit agronomic profile encryption active.
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="bg-white border-slate-200 text-slate-700 font-bold rounded-xl h-10 px-5 text-xs flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to System Defaults
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 px-6 text-xs flex items-center gap-2 shadow-md shadow-green-600/10 transition-all border-0"
                    >
                      <Save className="w-3.5 h-3.5 text-green-200" />
                      Save Configuration
                    </Button>
                  </div>
                </div>

              </form>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
