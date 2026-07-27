import React, { useState } from 'react';
import { BusRoute, User, Booking } from '../types';
import { SeatSelector } from './SeatSelector';
import { X, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Ticket, User as UserIcon, Mail, Phone, CreditCard, Sparkles, Luggage } from 'lucide-react';

interface BookingModalProps {
  route: BusRoute | null;
  currentUser: User | null;
  onClose: () => void;
  onConfirmBooking: (bookingData: Omit<Booking, 'id' | 'bookingRef' | 'bookedAt' | 'status'>) => void;
  travelDate: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  route,
  currentUser,
  onClose,
  onConfirmBooking,
  travelDate,
}) => {
  if (!route) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["1A"]);
  const [passengerName, setPassengerName] = useState(currentUser?.name || "");
  const [passengerEmail, setPassengerEmail] = useState(currentUser?.email || "");
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || "");
  const [hasExtraLuggage, setHasExtraLuggage] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seat toggle handler
  const handleToggleSeat = (seatNo: string) => {
    if (selectedSeats.includes(seatNo)) {
      if (selectedSeats.length === 1) return; // Must have at least 1 seat selected
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      if (selectedSeats.length >= 4) return;
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  // Pricing calculations
  const calculateSeatExtra = (seatNo: string) => {
    if (seatNo.startsWith('1')) return 5.0; // VIP row
    if (seatNo.startsWith('2')) return 3.0;
    return 0;
  };

  const seatsExtraTotal = selectedSeats.reduce((acc, s) => acc + calculateSeatExtra(s), 0);
  const basePriceTotal = route.price * selectedSeats.length;
  const luggagePrice = hasExtraLuggage ? 10.0 : 0;
  const taxesFees = (basePriceTotal + seatsExtraTotal) * 0.08;
  const grandTotal = basePriceTotal + seatsExtraTotal + luggagePrice + taxesFees;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName || !passengerEmail || !passengerPhone) return;

    setIsSubmitting(true);

    const newBookingData = {
      userId: currentUser?.id || "guest-user",
      routeId: route.id,
      origin: route.origin,
      originTerminal: route.originTerminal,
      destination: route.destination,
      destinationTerminal: route.destinationTerminal,
      companyName: route.companyName,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      durationHours: route.durationHours,
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      seats: selectedSeats,
      passengerName,
      passengerEmail,
      passengerPhone,
      totalPrice: Number(grandTotal.toFixed(2)),
      qrCodeValue: `TI-${route.id}-${selectedSeats.join('')}-${Date.now()}`
    };

    setTimeout(() => {
      onConfirmBooking(newBookingData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto text-white shadow-2xl relative my-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Book Bus Journey</h2>
              <div className="text-xs text-slate-400 font-medium">
                {route.companyName} • {route.origin} → {route.destination}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-around text-xs font-bold">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-teal-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800'}`}>1</span>
            Select Seats
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-teal-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800'}`}>2</span>
            Passenger Details
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-teal-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800'}`}>3</span>
            Payment
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6">

          {/* STEP 1: Seat Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7">
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
                  Pick Your Seat(s) on the Interactive Bus Deck
                </h3>
                <SeatSelector
                  route={route}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                  maxSeatsAllowed={4}
                />
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white pb-3 border-b border-slate-800 uppercase tracking-wider">
                    Journey Details
                  </h4>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Travel Date:</span>
                      <span className="font-bold text-white">{travelDate || 'Today'}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Departure:</span>
                      <span className="font-bold text-emerald-400">{route.departureTime}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Arrival:</span>
                      <span className="font-bold text-teal-400">{route.arrivalTime}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Selected Seat(s):</span>
                      <span className="font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                        {selectedSeats.join(', ')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Base Fare ({selectedSeats.length} x ${route.price.toFixed(2)})</span>
                        <span>${basePriceTotal.toFixed(2)}</span>
                      </div>
                      {seatsExtraTotal > 0 && (
                        <div className="flex justify-between text-amber-400">
                          <span>VIP Legroom Extras</span>
                          <span>+${seatsExtraTotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-400">
                        <span>Estimated Taxes & Fees</span>
                        <span>${taxesFees.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs text-slate-400 uppercase font-bold">Total Price</span>
                    <span className="text-2xl font-black text-white">${grandTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    Continue to Passenger Info
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Passenger Info */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-base font-extrabold text-white mb-4">
                Passenger Contact Details
              </h3>

              <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-teal-400" /> Full Passenger Name
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-400" /> Mobile Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {/* Extra Luggage Option */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasExtraLuggage}
                      onChange={(e) => setHasExtraLuggage(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-950"
                    />
                    <div className="flex items-center gap-3">
                      <Luggage className="w-5 h-5 text-teal-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Add Extra Checked Luggage (+$10.00)</div>
                        <div className="text-[11px] text-slate-400">1 standard suitcase (50lbs) is included free. Check this for an additional bag.</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Seats
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!passengerName || !passengerEmail || !passengerPhone}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Confirmation */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="max-w-2xl mx-auto">
              <h3 className="text-base font-extrabold text-white mb-4">
                Secure Checkout & Reservation
              </h3>

              <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
                
                {/* Final Breakdown Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Passenger:</span>
                    <span className="font-bold text-white">{passengerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Route:</span>
                    <span className="font-bold text-teal-300">{route.origin} → {route.destination}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Seats:</span>
                    <span className="font-mono font-bold text-emerald-400">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      Credit / Debit Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'apple'
                          ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Apple Pay / Google Pay
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      PayPal Express
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  Your reservation is protected with instant confirmation and instant digital ticket issuance.
                </div>

              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/30 hover:opacity-95 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Reservation...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      Confirm & Pay ${grandTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
