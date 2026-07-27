import React from 'react';
import { Search, MapPin, Calendar, Bus, ArrowRightLeft, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockData';

interface SearchHeroProps {
  origin: string;
  setOrigin: (city: string) => void;
  destination: string;
  setDestination: (city: string) => void;
  travelDate: string;
  setTravelDate: (date: string) => void;
  selectedCompanyFilter: string;
  setSelectedCompanyFilter: (companyId: string) => void;
  companies: { id: string; name: string }[];
  onSearch: () => void;
  onAskAI: (topic: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  travelDate,
  setTravelDate,
  selectedCompanyFilter,
  setSelectedCompanyFilter,
  companies,
  onSearch,
  onAskAI,
}) => {
  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      
      {/* Decorative Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Smart Bus Booking & AI Trip Planner
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Compare Bus Routes, Schedules & Book Your Seats Instantly
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 font-normal">
            Direct schedules from top-rated carriers including AeroExpress, Pacific Horizon, and MetroLink with 2D interactive seat selection.
          </p>
        </div>

        {/* Search Card Container */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-950/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Origin City */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Departure From
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
              >
                <option value="">All Departure Cities</option>
                {POPULAR_CITIES.map((city) => (
                  <option key={`origin-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={swapCities}
                title="Swap origin and destination"
                className="w-10 h-10 rounded-2xl bg-slate-700/80 hover:bg-slate-600 border border-slate-600 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <ArrowRightLeft className="w-4 h-4 text-teal-400" />
              </button>
            </div>

            {/* Destination City */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
              >
                <option value="">All Destination Cities</option>
                {POPULAR_CITIES.map((city) => (
                  <option key={`dest-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" /> Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
              />
            </div>

            {/* Search Action Button */}
            <div className="md:col-span-2 pt-2 md:pt-6">
              <button
                onClick={onSearch}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                Find Buses
              </button>
            </div>

          </div>

          {/* Secondary Filters Bar */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Bus Company Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Filter Carrier:</span>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-white text-xs font-semibold focus:ring-1 focus:ring-teal-500 outline-none"
              >
                <option value="ALL">All Bus Companies</option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Popular Route Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Popular Routes:</span>
              <button
                type="button"
                onClick={() => handleQuickRoute('New York, NY', 'Boston, MA')}
                className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-colors font-medium"
              >
                NYC → Boston
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoute('San Francisco, CA', 'Los Angeles, CA')}
                className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-colors font-medium"
              >
                SF → LA
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoute('Washington, DC', 'Philadelphia, PA')}
                className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-colors font-medium"
              >
                DC → Philly
              </button>
            </div>

          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Live Availability</div>
              <div className="text-[11px] text-slate-400">Real-time seat mapping</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Verified Carriers</div>
              <div className="text-[11px] text-slate-400">4.5+ average rating</div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">AI Travel Assistant</div>
              <div className="text-[11px] text-slate-400">Powered by OpenAI</div>
            </div>
          </div>

          <div 
            onClick={() => onAskAI("What is the luggage policy for bus travel?")}
            className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 cursor-pointer rounded-2xl p-3 flex items-center justify-between transition-colors"
          >
            <div>
              <div className="text-xs font-bold text-teal-300">Need Trip Advice?</div>
              <div className="text-[11px] text-slate-400">Ask TravelBot AI →</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
