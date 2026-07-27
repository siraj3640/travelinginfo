import React from 'react';
import { Seat, BusRoute } from '../types';
import { Armchair, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface SeatSelectorProps {
  route: BusRoute;
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  maxSeatsAllowed?: number;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  route,
  selectedSeats,
  onToggleSeat,
  maxSeatsAllowed = 4,
}) => {
  // Generate a realistic 10-row x 4-seat grid (A, B [Aisle] C, D)
  const rowsCount = 10;
  const cols = ['A', 'B', 'C', 'D'] as const;

  const isSeatOccupied = (seatNo: string) => {
    return route.bookedSeatNumbers.includes(seatNo);
  };

  const getSeatType = (row: number, col: string): 'vip' | 'window' | 'aisle' | 'standard' => {
    if (row === 1) return 'vip';
    if (col === 'A' || col === 'D') return 'window';
    return 'aisle';
  };

  const getSeatExtraPrice = (row: number): number => {
    if (row === 1) return 5.0; // VIP Front row legroom
    if (row === 2) return 3.0;
    return 0;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
      
      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            1A
          </div>
          <span className="text-slate-300">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-teal-300 font-bold">Selected ({selectedSeats.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-bold">
            VIP
          </div>
          <span className="text-amber-300">Front Legroom (+$5)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-600 flex items-center justify-center opacity-60 cursor-not-allowed">
            <X className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-500">Booked</span>
        </div>
      </div>

      {/* Interactive Bus Interior Map Container */}
      <div className="max-w-md mx-auto bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-inner">
        
        {/* Front Bus Driver Cabin */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeWidth="2" d="M12 3v18M3 12h18" />
              </svg>
            </div>
            Driver Cabin
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">FRONT OF BUS</span>
        </div>

        {/* Bus Windows Left & Right Decor */}
        <div className="relative">
          <div className="absolute left-[-16px] top-0 bottom-0 w-1 bg-slate-800 rounded-full" />
          <div className="absolute right-[-16px] top-0 bottom-0 w-1 bg-slate-800 rounded-full" />

          {/* Seat Rows Grid */}
          <div className="space-y-3">
            {Array.from({ length: rowsCount }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const extraPrice = getSeatExtraPrice(rowNum);

              return (
                <div key={`row-${rowNum}`} className="flex items-center justify-between gap-2">
                  
                  {/* Left Side (Seats A & B) */}
                  <div className="flex items-center gap-2">
                    {['A', 'B'].map((col) => {
                      const seatNo = `${rowNum}${col}`;
                      const occupied = isSeatOccupied(seatNo);
                      const selected = selectedSeats.includes(seatNo);
                      const isVip = rowNum === 1;

                      return (
                        <button
                          key={seatNo}
                          disabled={occupied}
                          onClick={() => onToggleSeat(seatNo)}
                          title={`${seatNo} (${col === 'A' ? 'Window' : 'Aisle'}) ${extraPrice > 0 ? `+$${extraPrice}` : ''}`}
                          className={`w-11 h-11 rounded-xl font-mono text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                            occupied
                              ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                              : selected
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-lg shadow-teal-500/30 scale-105 ring-2 ring-white'
                              : isVip
                              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white'
                          }`}
                        >
                          {selected ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : (
                            <>
                              <span>{seatNo}</span>
                              {extraPrice > 0 && (
                                <span className="text-[8px] -mt-1 font-sans text-amber-400 font-semibold">+${extraPrice}</span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Path */}
                  <div className="flex-1 text-center font-mono text-[10px] text-slate-600 tracking-widest select-none">
                    ROW {rowNum}
                  </div>

                  {/* Right Side (Seats C & D) */}
                  <div className="flex items-center gap-2">
                    {['C', 'D'].map((col) => {
                      const seatNo = `${rowNum}${col}`;
                      const occupied = isSeatOccupied(seatNo);
                      const selected = selectedSeats.includes(seatNo);
                      const isVip = rowNum === 1;

                      return (
                        <button
                          key={seatNo}
                          disabled={occupied}
                          onClick={() => onToggleSeat(seatNo)}
                          title={`${seatNo} (${col === 'D' ? 'Window' : 'Aisle'}) ${extraPrice > 0 ? `+$${extraPrice}` : ''}`}
                          className={`w-11 h-11 rounded-xl font-mono text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                            occupied
                              ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                              : selected
                              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-lg shadow-teal-500/30 scale-105 ring-2 ring-white'
                              : isVip
                              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white'
                          }`}
                        >
                          {selected ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : (
                            <>
                              <span>{seatNo}</span>
                              {extraPrice > 0 && (
                                <span className="text-[8px] -mt-1 font-sans text-amber-400 font-semibold">+${extraPrice}</span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Rear Bus Restroom */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-800 text-center">
          <span className="text-[10px] px-3 py-1 rounded bg-slate-800 text-slate-400 font-mono uppercase tracking-wider">
            REAR ENGINE & ONBOARD RESTROOM
          </span>
        </div>

      </div>

      {/* Selected Seats Warning */}
      {selectedSeats.length >= maxSeatsAllowed && (
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          Maximum limit of {maxSeatsAllowed} seats selected per booking transaction.
        </div>
      )}

    </div>
  );
};
