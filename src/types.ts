export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberSince: string;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  preferences: {
    preferredSeatType: 'window' | 'aisle' | 'front';
    emailAlerts: boolean;
    smsNotifications: boolean;
  };
}

export interface BusCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  description: string;
  amenities: string[];
  badge?: string;
  contactPhone: string;
}

export interface BusRoute {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  origin: string;
  originTerminal: string;
  destination: string;
  destinationTerminal: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: string;
  price: number;
  busType: string;
  amenities: string[];
  totalSeats: number;
  availableSeats: number;
  bookedSeatNumbers: string[];
  scheduleDays: string[];
}

export interface Seat {
  id: string;
  row: number;
  col: 'A' | 'B' | 'C' | 'D';
  seatNumber: string;
  type: 'window' | 'aisle' | 'standard' | 'vip';
  priceExtra: number;
  isOccupied: boolean;
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  routeId: string;
  origin: string;
  destination: string;
  originTerminal: string;
  destinationTerminal: string;
  companyName: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: string;
  travelDate: string;
  seats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookedAt: string;
  qrCodeValue?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
}

export interface OpenAISettings {
  apiKey: string;
  hasKey: boolean;
  source: string;
  maskedKey: string | null;
}
