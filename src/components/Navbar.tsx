import React from 'react';
import { Bus, Bot, User as UserIcon, Settings, Calendar, Building2, Search, Key, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'search' | 'companies' | 'bookings' | 'ai' | 'profile';
  setActiveTab: (tab: 'search' | 'companies' | 'bookings' | 'ai' | 'profile') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  hasOpenAIKey: boolean;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenSettings,
  hasOpenAIKey,
  bookingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                travelinginfo
              </span>
              <span className="block text-[10px] font-medium text-teal-400 tracking-wider uppercase -mt-1">
                Bus Routes & AI Planner
              </span>
            </div>
          </div>

          {/* Center Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Search className="w-4 h-4" />
              Routes & Search
            </button>

            <button
              onClick={() => setActiveTab('companies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'companies'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Bus Companies
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings
              {bookingCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'bookings' ? 'bg-slate-950 text-teal-300' : 'bg-teal-500/20 text-teal-300'
                }`}>
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
              AI Assistant
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                hasOpenAIKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {hasOpenAIKey ? 'GPT-4' : 'Smart'}
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* OpenAI API Key Settings Button */}
            <button
              onClick={onOpenSettings}
              title="OpenAI API Settings"
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">API Key</span>
              {hasOpenAIKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping" />
              )}
            </button>

            {/* Profile / Auth Button */}
            {currentUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all ${
                  activeTab === 'profile'
                    ? 'bg-slate-800 border-teal-500/50 text-teal-300'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-white'
                }`}
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-none">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{currentUser.loyaltyTier} Member</div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'search' ? 'text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'companies' ? 'text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Buses
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg relative ${
              activeTab === 'bookings' ? 'text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'ai' ? 'text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            AI Bot
          </button>
        </div>

      </div>
    </header>
  );
};
