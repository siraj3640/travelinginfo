import React from 'react';
import { BusCompany } from '../types';
import { Star, Bus, Phone, ShieldCheck, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

interface CompanyCardProps {
  company: BusCompany;
  routeCount: number;
  onViewRoutes: (companyId: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, routeCount, onViewRoutes }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between group">
      <div>
        {/* Header Badge & Image */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-teal-400/50 transition-all"
            />
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {company.rating}
                </div>
                <span className="text-xs text-slate-400">({company.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {company.badge && (
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
              {company.badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {company.description}
        </p>

        {/* Amenities List */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Onboard Amenities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {company.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Bus className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-bold text-white">{routeCount}</span> active routes
        </div>

        <button
          onClick={() => onViewRoutes(company.id)}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 font-extrabold text-xs border border-slate-700/80 transition-all flex items-center gap-1.5 active:scale-95"
        >
          View Timings & Routes
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
