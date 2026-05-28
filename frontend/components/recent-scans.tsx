import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export function RecentScans() {
  const scans = [
    {
      id: 1,
      crop: 'Tomato Leaf',
      disease: 'Early Blight',
      date: '2 hours ago',
      severity: 'High',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      crop: 'Corn Leaf',
      disease: 'Rust',
      date: '5 hours ago',
      severity: 'Moderate',
      image: 'https://images.unsplash.com/photo-1621252973163-aa8087fc767e?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      crop: 'Potato Leaf',
      disease: 'Healthy',
      date: 'Yesterday',
      severity: 'None',
      image: 'https://images.unsplash.com/photo-1518994220020-f4b66df2d499?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 4,
      crop: 'Wheat',
      disease: 'Powdery Mildew',
      date: 'Yesterday',
      severity: 'Low',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <Card className="border-0 shadow-sm rounded-2xl bg-white h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Recent Scans</CardTitle>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {scans.map((scan) => (
            <div key={scan.id} className="flex gap-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative">
                <img src={scan.image} alt={scan.crop} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{scan.crop}</h4>
                  <Badge 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0 font-medium border-0 rounded"
                    style={{
                      backgroundColor: ({
                        'none': '#F0FFF4',
                        'low': '#EBF8FF',
                        'moderate': '#FFFBEB',
                        'high': '#FFF5F5',
                        'critical': '#1A0000'
                      } as Record<string, string>)[String(scan.severity).toLowerCase()] || '#FFFBEB',
                      color: ({
                        'none': '#276749',
                        'low': '#2B6CB0',
                        'moderate': '#B7791F',
                        'high': '#C53030',
                        'critical': '#FF4444'
                      } as Record<string, string>)[String(scan.severity).toLowerCase()] || '#B7791F'
                    }}
                  >
                    {String(scan.severity).charAt(0).toUpperCase() + String(scan.severity).slice(1).toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate mb-1">{scan.disease}</p>
                <div className="flex items-center text-xs text-gray-400 gap-1">
                  <Clock className="w-3 h-3" />
                  {scan.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
