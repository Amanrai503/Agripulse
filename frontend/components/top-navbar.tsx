import React from 'react';
import { Search, Bell, HelpCircle, User } from 'lucide-react';

export function TopNavbar() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50"
          placeholder="Search fields, scans, or diseases..."
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        <button className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">Dr. Smith</span>
        </button>
      </div>
    </header>
  );
}
