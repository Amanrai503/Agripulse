"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopNavbar } from '@/components/top-navbar';
import { Search, ShieldCheck, Droplet, LayoutGrid, CheckCircle2, ScanLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface Disease {
  disease_id: number;
  disease_name: string;
  status: string;
  severity: string;
  description: string;
  symptoms: string;
  solution: string;
  wiki_url: string;
  image_path: string;
  cause?: string;
  crop_type?: string;
}

export default function EncyclopediaPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCropType, setFilterCropType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterCause, setFilterCause] = useState('');

  useEffect(() => {
    async function fetchDiseases() {
      try {
        const res = await fetch('/api/diseases');
        const data = await res.json();
        if (data.diseases) {
          setDiseases(data.diseases);
        }
      } catch (error) {
        console.error("Failed to fetch diseases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          disease.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCropType = filterCropType === '' || filterCropType === 'All' || disease.crop_type === filterCropType;
    const matchesSeverity = filterSeverity === '' || filterSeverity === 'All' || disease.severity === filterSeverity;
    const matchesCause = filterCause === '' || filterCause === 'All' || disease.cause === filterCause;

    return matchesSearch && matchesCropType && matchesSeverity && matchesCause;
  });

  return (
    <div className="flex min-h-screen bg-[#f5f7f4] font-sans selection:bg-green-100 selection:text-green-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8">
            
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Search and Filters Header */}
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50"
                    placeholder="Search diseases, crops, or symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <select 
                    className="border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none min-w-[140px]"
                    value={filterCropType}
                    onChange={(e) => setFilterCropType(e.target.value)}
                  >
                    <option value="" disabled hidden>Crop Type</option>
                    <option value="All">All</option>
                    {Array.from(new Set(diseases.map(d => d.crop_type).filter(Boolean))).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select 
                    className="border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none min-w-[140px]"
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="" disabled hidden>Severity</option>
                    <option value="All">All</option>
                    {Array.from(new Set(diseases.map(d => d.severity).filter(Boolean))).map(severity => (
                      <option key={severity} value={severity}>{severity}</option>
                    ))}
                  </select>
                  <select 
                    className="border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none min-w-[140px]"
                    value={filterCause}
                    onChange={(e) => setFilterCause(e.target.value)}
                  >
                    <option value="" disabled hidden>Cause</option>
                    <option value="All">All</option>
                    {Array.from(new Set(diseases.map(d => d.cause).filter(Boolean))).map(cause => (
                      <option key={cause} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Disease Grid */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                  {filteredDiseases.map((disease) => {
                    const nameParts = disease.disease_name.split(' with ');
                    const fallbackCropType = nameParts.length > 1 ? nameParts[0] : 'Crop';
                    const diseaseNamePart = nameParts.length > 1 ? nameParts[1] : disease.disease_name;
                    const cropType = disease.crop_type || fallbackCropType;

                    return (
                      <div key={disease.disease_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                        <div className="p-4">
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">

                            <Image
                              src={disease.image_path ? `/disease_pics/${disease.image_path}` : '/placeholder.jpg'}
                              alt={disease.disease_name}
                              width={400}
                              height={400}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).srcset = '/placeholder.jpg';
                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                              }}
                            />
                          </div>
                          
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight mb-1">{diseaseNamePart}</h3>
                            <p className="text-sm text-gray-500 font-medium">{cropType} Crop</p>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed flex-1">
                            {disease.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-6 mt-auto pt-4">
                            {disease.severity && (
                              <Badge className={`uppercase text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                                disease.severity.toLowerCase() === 'critical' || disease.severity.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-100 border-transparent shadow-none' : 
                                disease.severity.toLowerCase() === 'medium' || disease.severity.toLowerCase() === 'moderate' ? 'bg-[#3b1e28] text-pink-100 hover:bg-[#3b1e28] border-transparent shadow-none' :
                                'bg-gray-100 text-gray-700 hover:bg-gray-100 border-transparent shadow-none'
                              }`}>
                                {disease.severity === 'high' || disease.severity === 'critical' ? 'SEVERE' : disease.severity === 'medium' ? 'MODERATE' : disease.severity}
                              </Badge>
                            )}
                            {disease.cause && (
                              <Badge className={`uppercase text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border-transparent shadow-none ${
                                disease.cause.toLowerCase() === 'fungal' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                disease.cause.toLowerCase() === 'bacterial' ? 'bg-pink-100 text-pink-800 hover:bg-pink-100' :
                                'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              }`}>
                                {disease.cause}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            <a href={disease.wiki_url || '#'} target="_blank" rel="noopener noreferrer">
                              <Button className="w-full bg-[#3d5a3e] hover:bg-[#2d432e] text-white rounded-lg h-10 transition-colors">
                                View Details
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-80 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
              
              {/* Today's Tips */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1b3b27]"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-[#1b3b27]" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Today's Tips</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Droplet className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Optimize Irrigation</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Avoid overhead watering to reduce foliage moisture levels.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <LayoutGrid className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Crop Rotation</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Rotate crops annually to break disease life cycles in the soil.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Certified Seeds</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">Only use disease-free, certified seeds from verified vendors.</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-6 rounded-lg text-sm border-gray-200 text-gray-600 hover:bg-gray-50">
                  Read Full Guide
                </Button>
              </div>

              {/* Promo Banner */}
              <div className="bg-[#4a674b] rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-green-900/10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3d5a3e]/50 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                    <ScanLine className="w-6 h-6 text-green-100" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Found something?</h3>
                  <p className="text-sm text-green-50 leading-relaxed mb-6">
                    Use our AI Scanner for instant, on-site disease identification with 98% accuracy.
                  </p>
                  <Link href="/scanner" className="w-full block">
                    <Button className="w-full bg-white text-[#4a674b] hover:bg-gray-50 rounded-lg font-semibold shadow-sm transition-colors">
                      Launch Scanner
                    </Button>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
