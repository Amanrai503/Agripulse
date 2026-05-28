"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopNavbar } from '@/components/top-navbar';
import { ScannerMain } from '@/components/scanner-main';
import { ScanHistoryTable } from '@/components/history-table';
import { AnalysisResult } from '@/components/analysis-result';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleScanResult = (result: any) => {
    setScanResult(result);
    if (result) {
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Crop Disease Scanner</h2>
                <p className="text-gray-500 text-sm max-w-2xl">
                  Upload a crop or leaf image to detect diseases and receive treatment recommendations instantly.
                </p>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 shadow-sm rounded-full font-medium">
                  <Activity className="w-4 h-4 mr-1.5 animate-pulse text-green-600" />
                  AI Model Online
                </Badge>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - Scanner & Table */}
              <div className="xl:col-span-2 flex flex-col min-w-0">
                <ScannerMain onResult={handleScanResult} />
              </div>
              
              {/* Right Column - Sidebar Panel */}
              <div className="xl:col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 flex flex-col">
                <ScanHistoryTable refreshKey={refreshKey} />
              </div>

            </div>

            {/* Analysis Result (Bottom) */}
            <AnalysisResult result={scanResult} />
            
          </div>
        </main>
      </div>
    </div>
  );
}
