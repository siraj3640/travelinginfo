import React, { useState } from 'react';
import { User } from '../types';
import { DEFAULT_USER } from '../data/mockData';
import { X, User as UserIcon, Mail, Lock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name: name || DEFAULT_USER.name,
      email: email || DEFAULT_USER.email,
    };
    onLoginSuccess(newUser);
  };

  const handleDemoLogin = () => {
    onLoginSuccess(DEFAULT_USER);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 text-white shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold mx-auto flex items-center justify-center mb-3">
            <UserIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isSignUp ? 'Create Traveling Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access saved bookings, rewards, and passenger details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="my-4 relative text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-bold">Or Demo Login</span>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Continue with Demo Account (Alex Rivera)
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-teal-300 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};
