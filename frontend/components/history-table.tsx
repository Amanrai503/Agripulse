"use client";

import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScanHistoryTable({ refreshKey = 0 }: { refreshKey?: number }) {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/scans');
      const data = await response.json();
      setHistory(data.scans || []);
    } catch (error) {
      console.error("Failed to fetch scan history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);
  const getSeverityBadge = (rawSeverity: string) => {
    const severityColors: Record<string, { bg: string, text: string }> = {
      'none': { bg: '#F0FFF4', text: '#276749' },
      'low': { bg: '#EBF8FF', text: '#2B6CB0' },
      'moderate': { bg: '#FFFBEB', text: '#B7791F' },
      'high': { bg: '#FFF5F5', text: '#C53030' },
      'critical': { bg: '#1A0000', text: '#FF4444' }
    };
    
    const severityStr = String(rawSeverity || 'Moderate');
    const severityKey = severityStr.toLowerCase();
    const colors = severityColors[severityKey] || severityColors['moderate'];
    
    const severityLevel = severityStr.charAt(0).toUpperCase() + severityStr.slice(1).toLowerCase();
    
    return (
      <Badge 
        variant="outline" 
        className="border-0 font-medium" 
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {severityLevel}
      </Badge>
    );
  };

  return (
    <Card className="border-0 shadow-sm rounded-2xl bg-white h-[420px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 mb-4 shrink-0">
        <CardTitle className="text-xl font-bold text-gray-900">Scan History</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-200 text-gray-600">
            <Filter className="w-3 h-3 mr-1.5" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-gray-200 text-gray-600">
            <FileDown className="w-3 h-3 mr-1.5" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="font-semibold text-gray-600 py-4">Crop Type</TableHead>
                <TableHead className="font-semibold text-gray-600">Plant Condition</TableHead>
                <TableHead className="font-semibold text-gray-600">Severity</TableHead>
                <TableHead className="font-semibold text-gray-600">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Loading scan history...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No scans found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((row) => (
                  <TableRow key={row.scan_id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                    <TableCell className="text-gray-600 py-3">{row.crop_type}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{row.disease_name}</TableCell>
                    <TableCell>{getSeverityBadge(row.severity)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(row.scanned_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
