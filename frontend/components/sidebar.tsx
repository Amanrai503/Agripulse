"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Leaf, 
  Map, 
  BookOpen, 
  FileText, 
  Settings,
  LeafyGreen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Leaf Scanner', icon: Leaf, href: '/scanner' },
    { name: 'Field Management', icon: Map, href: '/field-management' },
    { name: 'Disease Encyclopedia', icon: BookOpen, href: '/encyclopedia' },
    { name: 'Reports', icon: FileText, href: '/reports' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-xl">
          <LeafyGreen className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-gray-900">AgriPulse</h1>
          <p className="text-xs text-gray-500 font-medium">Crop Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-500 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-gray-100">
        <Link href="/scanner" className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all h-11 rounded-xl">
            <Leaf className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>
    </aside>
  );
}
