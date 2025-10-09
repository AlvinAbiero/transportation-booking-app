import {
  Vehicle,
  VehicleBooking,
  TaxiBooking,
  Customer,
  Location,
  VehicleCategory,
  BookingStatus,
  PaymentMethod,
  // PaymentStatus,
} from "@prisma/client";
import { LineString } from "geojson";

// API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Vehicle Rental Types

export interface VehicleAvailabilityQuery {
  pickupDate: string; // ISO date string
  dropoffDate: string;
  locationId: string;
}

export interface VehicleWithLocation extends Vehicle {
  location: Location;
}

export interface CreateVehicleBookingInput {
  customerId?: string; // Optional if creating customer inline
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address?: string;
    city?: string;
    drivingLicense?: string;
    licenseExpiry?: string;
    licenseImageUrl?: string;
  };
  vehicleId: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  paymentMethod: PaymentMethod;
  specialRequests?: string;
}

export interface VehicleBookingWithRelations extends VehicleBooking {
  customer: Customer;
  vehicle: VehicleWithLocation;
  pickupLocation: Location;
  dropoffLocation: Location;
}

// Taxi Booking Types
export interface TaxiRouteCalculationInput {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}

export interface TaxiRouteResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  route?: MapboxDirectionsResponse["routes"][number]; // Full Mapbox route data
}

export interface TaxiPriceCalculation {
  categoryId: string;
  categoryName: string;
  seats: number;
  basePrice: number;
  pricePerKm: number;
  distance: number;
  calculatedPrice: number;
  tax: number;
  totalAmount: number;
}

export interface CreateTaxiBookingInput {
  customerId?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
  };
  pickupLocationId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLocationId: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  categoryId: string;
  pickupDateTime: string;
  passengers: number;
  specialRequests?: string;
}

export interface TaxiBookingWithRelations extends TaxiBooking {
  customer: Customer;
  category: VehicleCategory;
  pickupLocation: Location;
  dropoffLocation: Location;
}

// Admin Dashboard Types
export interface BookingFilters {
  status?: BookingStatus;
  type?: "vehicle" | "taxi";
  startDate?: string;
  endDate?: string;
  search?: string; // Search by booking number, customer name, email
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  today: {
    vehicleBookings: number;
    taxiBookings: number;
    totalRevenue: number;
  };
  thisWeek: {
    vehicleBookings: number;
    taxiBookings: number;
    totalRevenue: number;
  };
  thisMonth: {
    vehicleBookings: number;
    taxiBookings: number;
    totalRevenue: number;
  };
  pending: {
    vehicleBookings: number;
    taxiBookings: number;
  };
  recentBookings: Array<{
    id: string;
    type: "vehicle" | "taxi";
    bookingNumber: string;
    customerName: string;
    amount: number;
    status: BookingStatus;
    createdAt: Date;
  }>;
}

export interface ConfirmBookingInput {
  bookingId: string;
  type: "vehicle" | "taxi";
  notes?: string;
}

// Mapbox Types
export interface MapboxCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapboxDirectionsResponse {
  routes: Array<{
    distance: number; // in meters
    duration: number; // in seconds
    geometry: LineString;
  }>;
}

// Email Types
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface VehicleBookingEmailData {
  booking: VehicleBookingWithRelations;
  customerName: string;
  vehicleName: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: string;
  bookingNumber: string;
}

export interface TaxiBookingEmailData {
  booking: TaxiBookingWithRelations;
  customerName: string;
  categoryName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  distance: string;
  duration: string;
  totalAmount: string;
  bookingNumber: string;
  passengers: number;
}

// Validation Schemas (for Zod)

export interface ValidationError {
  field: string;
  message: string;
}

// Utility Types

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Date Range Utilities
export interface DateRange {
  start: Date;
  end: Date;
}
