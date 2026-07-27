import React from 'react';
import { BusRoute } from '../types';
import { Bus, Clock, MapPin, Wifi, Zap, Shield, ChevronRight, Armchair, Star } from 'lucide-react';

interface RouteCardProps {
  route: BusRoute;
  onBookRoute: (route: BusRoute) => void;
  onCompanyClick?: (companyId: string) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onBookRoute, onCompanyClick }) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-teal-400" />;
      case 'power outlets':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'restroom':
        return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Armchair className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-3xl p-5 sm:p-6 transition-all shadow-xl hover:shadow-2xl hover:shadow-slate-950/40 group">
      
      {/* Company Header & Bus Type Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div 
          onClick={() => onCompanyClick && onCompanyClick(route.companyId)}
          className="flex items-center gap-3 cursor-pointer group/comp"
        >
          <img
            src={route.companyLogo || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80"}
            alt={route.companyName}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 group-hover/comp:ring-teal-400 transition-all"
          />
          <div>
            <h3 className="text-base font-extrabold text-white group-hover/comp:text-teal-300 transition-colors flex items-center gap-1.5">
              {route.companyName}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {route.busType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-slate-800 text-teal-300 font-semibold border border-slate-700">
            <Armchair className="w-3.5 h-3.5 text-teal-400" />
            {route.availableSeats} seats left
          </span>
        </div>
      </div>

      {/* Main Timeline Section */}
      <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Departure */}
        <div className="md:col-span-4 text-left">
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {route.departureTime}
          </div>
          <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {route.origin}
          </div>
          <div className="text-xs text-slate-400 mt-1 line-clamp-1">
            {route.originTerminal}
          </div>
        </div>

        {/* Travel Duration Visual Line */}
        <div className="md:col-span-4 flex flex-col items-center justify-center my-2 md:my-0">
          <span className="text-xs font-bold text-teal-400 flex items-center gap-1 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 mb-1.5">
            <Clock className="w-3 h-3 text-teal-400" />
            {route.durationHours}
          </span>
          <div className="w-full flex items-center gap-2 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 relative">
              <Bus className="w-4 h-4 text-teal-300 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-900 rounded-full px-0.5" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Direct Journey</span>
        </div>

        {/* Arrival */}
        <div className="md:col-span-4 text-left md:text-right">
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {route.arrivalTime}
          </div>
          <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1 md:justify-end">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            {route.destination}
          </div>
          <div className="text-xs text-slate-400 mt-1 line-clamp-1">
            {route.destinationTerminal}
          </div>
        </div>

      </div>

      {/* Footer Amenities & Pricing Action */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Amenities Icons */}
        <div className="flex flex-wrap items-center gap-2">
          {route.amenities.map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium"
            >
              {getAmenityIcon(amenity)}
              {amenity}
            </span>
          ))}
        </div>

        {/* Price & Book CTA */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Per Passenger</span>
            <div className="text-2xl font-black text-white tracking-tight">
              ${route.price.toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => onBookRoute(route)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-md shadow-teal-500/20 hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
          >
            Select Seat
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>

    </div>
  );
};
