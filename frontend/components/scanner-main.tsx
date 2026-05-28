"use client";

import React, { useState } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  Bug,
  ThermometerSun,
  ShieldCheck,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function ScannerMain({ onResult }: { onResult?: (result: any) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Clear the input value so selecting the same file twice works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setStatus('idle');
    if (onResult) onResult(null);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    if (onResult) onResult(null);
  };

  const analyze = async () => {
    if (!file) return;
    setStatus('analyzing');
    if (onResult) onResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('farmer_id', '1'); // Default value for now
      formData.append('crop_type', 'Unknown'); // Default value for now

      const response = await fetch('/api/scans', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'API request failed');
      }

      const data = await response.json();
      
      const formattedResult = {
        disease: data.disease,
        confidence: Number(data.confidence).toFixed(2),
        severity: data.severity || 'Unknown',
        description: data.description,
        symptoms: data.symptoms,
        solution: data.solution,
        image_url: preview || data.image_url,
        crop_type: data.scan?.crop_type || 'Unknown Crop',
        recommendations: [
          {
            title: 'Description',
            desc: data.description,
            icon: Bug,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            title: 'Symptoms',
            desc: data.symptoms,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
          },
          {
            title: 'Recommended Treatment',
            desc: data.solution,
            icon: ShieldCheck,
            color: 'text-green-600',
            bg: 'bg-green-50'
          }
        ]
      };

      setStatus('complete');
      if (onResult) onResult(formattedResult);
    } catch (error: any) {
      console.error(error);
      setStatus('idle');
      alert(`Error analyzing crop: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Upload Card */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white h-[420px] flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col min-h-0">
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleChange}
          />
          {!preview ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-green-400 transition-colors cursor-pointer group flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Drag & drop crop image</h3>
              <p className="text-sm text-gray-500 mb-4">or click to browse from your device</p>
              <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between min-h-0">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 flex-1 min-h-0 flex items-center justify-center group">
                <img src={preview} alt="Crop preview" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                  <Button variant="destructive" onClick={removeFile}>
                    <X className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>

              {status === 'idle' && (
                <div className="flex justify-end shrink-0">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8 shadow-md" onClick={analyze}>
                    Analyze Crop
                  </Button>
                </div>
              )}
              
              {status === 'analyzing' && (
                <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center space-y-4 shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin relative z-10" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">Analyzing Image...</h3>
                    <p className="text-sm text-gray-500">Our AI model is scanning for over 50+ known diseases</p>
                  </div>
                  <Progress value={65} className="w-full max-w-md h-2 mt-4" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
