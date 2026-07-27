import React from 'react';
import { Booking } from '../types';
import { X, QrCode, Download, Printer, Bus, MapPin, Calendar, Clock, CheckCircle2, User as UserIcon, ShieldCheck } from 'lucide-react';

interface TicketModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl text-white shadow-2xl relative overflow-hidden my-auto">
        
        {/* Header Action Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Digital Boarding Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Ticket"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div id="printable-boarding-pass" className="p-6 bg-slate-900 space-y-6">
          
          {/* Main Boarding Pass Card Container */}
          <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            
            {/* Top Company Brand & Booking Ref */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center">
                  <Bus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{booking.companyName}</h3>
                  <div className="text-[11px] text-teal-400 font-bold">Ref: #{booking.bookingRef}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CONFIRMED
                </span>
              </div>
            </div>

            {/* Travel Route Timeline */}
            <div className="py-6 border-b border-slate-800 grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure</span>
                <div className="text-xl font-black text-white mt-0.5">{booking.departureTime}</div>
                <div className="text-xs font-bold text-emerald-400">{booking.origin}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{booking.originTerminal}</div>
              </div>

              <div className="col-span-2 flex flex-col items-center justify-center">
                <span className="text-[10px] text-teal-400 font-bold">{booking.durationHours}</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 my-1 relative">
                  <Bus className="w-3.5 h-3.5 text-teal-300 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-950 rounded-full px-0.5" />
                </div>
              </div>

              <div className="col-span-5 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Arrival</span>
                <div className="text-xl font-black text-white mt-0.5">{booking.arrivalTime}</div>
                <div className="text-xs font-bold text-teal-400">{booking.destination}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{booking.destinationTerminal}</div>
              </div>
            </div>

            {/* Ticket Key Info Grid */}
            <div className="py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Passenger</span>
                <div className="font-bold text-white mt-0.5 truncate">{booking.passengerName}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Travel Date</span>
                <div className="font-bold text-teal-300 mt-0.5">{booking.travelDate}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reserved Seat(s)</span>
                <div className="font-mono font-bold text-emerald-400 mt-0.5">{booking.seats.join(', ')}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Paid</span>
                <div className="font-black text-white mt-0.5">${booking.totalPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Boarding QR Code & Scannable Barcode */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <div className="w-16 h-16 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0">
                  {/* Styled Simulated QR Code SVG */}
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm13 0h3v3h-3v-3zm3-3h2v2h-2v-2zm-3-2h3v2h-3v-2zm-2 5h2v2h-2v-2zm2 2h3v2h-3v-2zm-5-9h2v2h-2V9zm0 3h2v2h-2v-2zm-2-3h2v2h-2V9zm0 5h2v2h-2v-2zm-3-2h2v2h-2v-2zm0 3h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Scan at Gate Entrance</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Val: {booking.bookingRef}</div>
                </div>
              </div>

              {/* Simulated Barcode */}
              <div className="text-center sm:text-right">
                <div className="h-8 w-36 bg-slate-800 rounded p-1 flex justify-between items-center space-x-1 opacity-80 mx-auto sm:ml-auto">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-slate-300 ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  E-TICKET BOARDING PASS • TRAVELINGINFO
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action Note */}
          <div className="text-center">
            <button
              onClick={handlePrint}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Download / Print Boarding Pass
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
