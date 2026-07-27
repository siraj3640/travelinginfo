import React from 'react';
import { Bus, Shield, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Bus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-black text-white">travelinginfo</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The modern full-stack bus booking & schedule platform with 2D interactive seat selection and OpenAI AI travel assistant.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Top Partners</h4>
          <ul className="text-xs space-y-2">
            <li>AeroExpress Lines</li>
            <li>Pacific Horizon Shuttles</li>
            <li>MetroLink Express</li>
            <li>Royal Coach Luxury</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Routes</h4>
          <ul className="text-xs space-y-2">
            <li>New York ↔ Boston</li>
            <li>San Francisco ↔ Los Angeles</li>
            <li>Washington DC ↔ Philadelphia</li>
            <li>Chicago ↔ Detroit</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Assistant</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Powered by Node.js Express server backend and optional OpenAI GPT-4 API integration.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
            <Sparkles className="w-3 h-3" />
            travelinginfo v1.0.0
          </span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2026 travelinginfo. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Help & Support</span>
        </div>
      </div>
    </footer>
  );
};
