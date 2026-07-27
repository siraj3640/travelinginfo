import React, { useState } from 'react';
import { User, Booking } from '../types';
import { User as UserIcon, Mail, Phone, Calendar, Award, Ticket, CheckCircle2, QrCode, Shield, Settings, Heart, LogOut } from 'lucide-react';

interface UserProfileProps {
  user: User;
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  bookings,
  onViewTicket,
  onLogout,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [preferredSeatType, setPreferredSeatType] = useState<'window' | 'aisle' | 'front'>(user.preferences.preferredSeatType);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      phone,
      preferences: {
        ...user.preferences,
        preferredSeatType,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      
      {/* Profile Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-xl"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-teal-300 font-extrabold border border-teal-500/30">
                  {user.loyaltyTier} Traveler
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                {user.email} • {user.phone}
              </p>
              <div className="text-xs text-slate-400 mt-2">
                Member since {user.memberSince} • <span className="text-amber-400 font-bold">{user.loyaltyPoints} Rewards Points</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Seat</label>
              <select
                value={preferredSeatType}
                onChange={(e: any) => setPreferredSeatType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              >
                <option value="window">Window Seat</option>
                <option value="aisle">Aisle Seat</option>
                <option value="front">Front Row VIP</option>
              </select>
            </div>
            <div className="sm:col-span-3 text-right">
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Booked Journeys Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-teal-400" />
            My Saved Bookings & Boarding Passes
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {bookings.length} {bookings.length === 1 ? 'reservation' : 'reservations'} total
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 space-y-3">
            <Ticket className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Active Bus Bookings Found</h3>
            <p className="text-xs max-w-sm mx-auto">You haven't reserved any bus tickets yet. Search available routes above to make your first booking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-black text-white">{booking.companyName}</span>
                      <div className="text-[11px] text-teal-400 font-mono">Ref: #{booking.bookingRef}</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-4 space-y-2">
                    <div className="text-sm font-bold text-slate-200">
                      {booking.origin} → {booking.destination}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Travel Date: <strong className="text-white">{booking.travelDate}</strong></span>
                      <span>Departure: <strong className="text-teal-300">{booking.departureTime}</strong></span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Seats: <strong className="text-emerald-400 font-mono">{booking.seats.join(', ')}</strong></span>
                      <span>Total: <strong className="text-white">${booking.totalPrice.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Passenger: {booking.passengerName}</span>
                  <button
                    onClick={() => onViewTicket(booking)}
                    className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    View Pass Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
