import React, { useState, useEffect } from 'react';
import { BusCompany, BusRoute, User, Booking, OpenAISettings } from './types';
import { DEFAULT_USER, INITIAL_BUS_COMPANIES, INITIAL_BUS_ROUTES, INITIAL_BOOKINGS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { RouteCard } from './components/RouteCard';
import { CompanyCard } from './components/CompanyCard';
import { BookingModal } from './components/BookingModal';
import { TicketModal } from './components/TicketModal';
import { AIAssistant } from './components/AIAssistant';
import { OpenAISettingsModal } from './components/OpenAISettingsModal';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Bus, Search, Filter, Sparkles, Building2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'companies' | 'bookings' | 'ai' | 'profile'>('search');
  
  // Search Filters
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');

  // Data Collections
  const [companies, setCompanies] = useState<BusCompany[]>(INITIAL_BUS_COMPANIES);
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_BUS_ROUTES);
  const [userBookings, setUserBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // User Auth & Settings
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_USER);
  const [openAISettings, setOpenAISettings] = useState<OpenAISettings>({
    apiKey: '',
    hasKey: false,
    source: 'none',
    maskedKey: null
  });

  // Active Modals
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<BusRoute | null>(null);
  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState<Booking | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load server initial data & OpenAI settings status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, routeRes, keyRes] = await Promise.all([
          fetch('/api/bus-companies').then(r => r.json()).catch(() => ({ companies: INITIAL_BUS_COMPANIES })),
          fetch('/api/bus-routes').then(r => r.json()).catch(() => ({ routes: INITIAL_BUS_ROUTES })),
          fetch('/api/settings/openai-key').then(r => r.json()).catch(() => ({ hasKey: false, maskedKey: null }))
        ]);

        if (compRes.companies && compRes.companies.length) setCompanies(compRes.companies);
        if (routeRes.routes && routeRes.routes.length) setRoutes(routeRes.routes);
        if (keyRes) {
          setOpenAISettings({
            apiKey: '',
            hasKey: keyRes.hasKey,
            source: keyRes.source || 'none',
            maskedKey: keyRes.maskedKey || null
          });
        }
      } catch (err) {
        console.warn("Using fallback local data:", err);
      }
    };

    fetchData();
  }, []);

  // Save key handler
  const handleSaveOpenAIKey = async (apiKey: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings/openai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      const data = await res.json();
      if (data.success) {
        setOpenAISettings({
          apiKey,
          hasKey: data.hasKey,
          source: 'custom',
          maskedKey: data.maskedKey
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Save OpenAI key error:", error);
      return false;
    }
  };

  // Confirm booking handler
  const handleConfirmBooking = async (bookingData: Omit<Booking, 'id' | 'bookingRef' | 'bookedAt' | 'status'>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      const confirmedBooking = data.booking || {
        ...bookingData,
        id: `bk-${Date.now()}`,
        bookingRef: `TI-${Math.floor(100000 + Math.random() * 900000)}`,
        bookedAt: new Date().toISOString(),
        status: 'confirmed' as const
      };

      setUserBookings(prev => [confirmedBooking, ...prev]);
      setSelectedRouteForBooking(null);
      setSelectedBookingForTicket(confirmedBooking);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  // Filtered routes calculation
  const filteredRoutes = routes.filter(route => {
    if (origin && !route.origin.toLowerCase().includes(origin.toLowerCase())) return false;
    if (destination && !route.destination.toLowerCase().includes(destination.toLowerCase())) return false;
    if (selectedCompanyFilter !== 'ALL' && route.companyId !== selectedCompanyFilter) return false;
    return true;
  });

  const handleCompanyRouteFilter = (companyId: string) => {
    setSelectedCompanyFilter(companyId);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        hasOpenAIKey={openAISettings.hasKey}
        bookingCount={userBookings.length}
      />

      {/* Main View Switcher */}
      <main className="flex-1">

        {/* TAB 1: Search & Routes Dashboard */}
        {activeTab === 'search' && (
          <div>
            <SearchHero
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              selectedCompanyFilter={selectedCompanyFilter}
              setSelectedCompanyFilter={setSelectedCompanyFilter}
              companies={companies}
              onSearch={() => {}}
              onAskAI={(topic) => setActiveTab('ai')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Bus className="w-6 h-6 text-emerald-400" />
                    Available Bus Routes & Schedules
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing {filteredRoutes.length} scheduled bus trips matching your criteria.
                  </p>
                </div>

                {selectedCompanyFilter !== 'ALL' && (
                  <button
                    onClick={() => setSelectedCompanyFilter('ALL')}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-teal-300 font-bold border border-slate-700 hover:bg-slate-700 transition-colors self-start sm:self-auto"
                  >
                    Clear Carrier Filter ×
                  </button>
                )}
              </div>

              {/* Route Cards Grid */}
              {filteredRoutes.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-4">
                  <Search className="w-12 h-12 mx-auto text-slate-600" />
                  <h3 className="text-lg font-bold text-white">No Matching Routes Found</h3>
                  <p className="text-xs max-w-md mx-auto">
                    Try resetting origin/destination filters or selecting "All Bus Companies" to view all active intercity schedules.
                  </p>
                  <button
                    onClick={() => { setOrigin(''); setDestination(''); setSelectedCompanyFilter('ALL'); }}
                    className="py-2.5 px-5 rounded-2xl bg-teal-500 text-slate-950 font-extrabold text-xs"
                  >
                    Reset All Search Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      onBookRoute={(r) => setSelectedRouteForBooking(r)}
                      onCompanyClick={handleCompanyRouteFilter}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: Bus Companies Dashboard */}
        {activeTab === 'companies' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Partner Carriers</span>
              <h1 className="text-3xl font-black text-white mt-1">Verified Bus Companies</h1>
              <p className="text-sm text-slate-300 mt-2">
                Discover fleet amenities, ratings, passenger reviews, and direct timing schedules from our official partner operators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company) => {
                const compRouteCount = routes.filter(r => r.companyId === company.id).length;
                return (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    routeCount={compRouteCount}
                    onViewRoutes={handleCompanyRouteFilter}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: My Bookings View */}
        {activeTab === 'bookings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {currentUser ? (
              <UserProfile
                user={currentUser}
                bookings={userBookings}
                onViewTicket={(bk) => setSelectedBookingForTicket(bk)}
                onLogout={() => setCurrentUser(null)}
                onUpdateUser={(usr) => setCurrentUser(usr)}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <Calendar className="w-12 h-12 mx-auto text-teal-400" />
                <h2 className="text-xl font-bold text-white">Sign In to View Bookings</h2>
                <p className="text-xs text-slate-400">
                  Please log in or continue with a demo account to manage your bus reservations and digital boarding passes.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="py-3 px-6 rounded-2xl bg-teal-500 text-slate-950 font-extrabold text-sm"
                >
                  Sign In / Demo Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI Travel Assistant View */}
        {activeTab === 'ai' && (
          <AIAssistant
            openAISettings={openAISettings}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        )}

        {/* TAB 5: User Profile View */}
        {activeTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {currentUser ? (
              <UserProfile
                user={currentUser}
                bookings={userBookings}
                onViewTicket={(bk) => setSelectedBookingForTicket(bk)}
                onLogout={() => setCurrentUser(null)}
                onUpdateUser={(usr) => setCurrentUser(usr)}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <Bus className="w-12 h-12 mx-auto text-teal-400" />
                <h2 className="text-xl font-bold text-white">User Profile</h2>
                <p className="text-xs text-slate-400">Sign in to view your profile settings and loyalty rewards.</p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="py-3 px-6 rounded-2xl bg-teal-500 text-slate-950 font-extrabold text-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal overlays */}
      {selectedRouteForBooking && (
        <BookingModal
          route={selectedRouteForBooking}
          currentUser={currentUser}
          travelDate={travelDate}
          onClose={() => setSelectedRouteForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {selectedBookingForTicket && (
        <TicketModal
          booking={selectedBookingForTicket}
          onClose={() => setSelectedBookingForTicket(null)}
        />
      )}

      {isSettingsModalOpen && (
        <OpenAISettingsModal
          settings={openAISettings}
          onClose={() => setIsSettingsModalOpen(false)}
          onSaveKey={handleSaveOpenAIKey}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(usr) => {
            setCurrentUser(usr);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
