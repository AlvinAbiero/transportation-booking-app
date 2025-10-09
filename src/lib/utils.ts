import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

// Tailwind Utility (for className merging)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Response Helpers

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function errorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>,
  status: number = 422
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Validation Error",
      data: { errors },
    },
    { status }
  );
}

// Error Classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// Try-Catch Wrapper for API Routes

export function asyncHandler<TData = unknown, TContext = unknown>(
  handler: (
    request: Request,
    context?: TContext
  ) => Promise<NextResponse<ApiResponse<TData>>>
) {
  return async (request: Request, context?: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode);
      }

      // Prisma errors
      if (error instanceof Error) {
        if (error.message.includes("Unique constraint")) {
          return errorResponse("Resource already exists", 409);
        }
        if (error.message.includes("Foreign key constraint")) {
          return errorResponse("Invalid reference to related resource", 400);
        }
      }

      return errorResponse(
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error instanceof Error
          ? error.message
          : "Unknown error",
        500
      );
    }
  };
}

// Date Utilities

export function formatDate(
  date: Date,
  format: "short" | "long" | "iso" = "short"
): string {
  if (format === "iso") {
    return date.toISOString();
  }

  const options: Intl.DateTimeFormatOptions =
    format === "long"
      ? {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : { year: "numeric", month: "short", day: "numeric" };

  return new Intl.DateTimeFormat("en-KE", options).format(date);
}

export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date format: ${dateString}`);
  }
  return date;
}

export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Validation Utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Kenyan phone number format: +254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function sanitizePhone(phone: string): string {
  // Convert to international format
  const cleaned = phone.trim().replace(/\s/g, "");
  if (cleaned.startsWith("0")) {
    return "+254" + cleaned.substring(1);
  }
  if (cleaned.startsWith("254")) {
    return "+" + cleaned;
  }
  return cleaned;
}

// Currency Utilities

export function formatCurrency(
  amount: number,
  currency: string = "KES"
): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(amountString: string): number {
  const cleaned = amountString.replace(/[^0-9.-]/g, "");
  const amount = parseFloat(cleaned);
  if (isNaN(amount)) {
    throw new ValidationError(`Invalid currency format: ${amountString}`);
  }
  return amount;
}

// Booking Number Generator

export function generateBookingNumber(type: "vehicle" | "taxi"): string {
  const prefix = type === "vehicle" ? "VR" : "TX";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Pagination Utilities

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export function getPaginationParams(
  params: PaginationParams,
  defaultLimit: number = 20,
  maxLimit: number = 100
): PaginationResult {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(maxLimit, Math.max(1, params.limit || defaultLimit));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

// String Utilities

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

// Object Utilities

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Array Utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Environment Utilities

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// Price Calculation Utilities

export function calculateNumberOfDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDateRangeValid(startDate: Date, endDate: Date): boolean {
  return startDate < endDate && startDate >= new Date();
}

export function calculateVehicleBookingPrice(
  pricePerDay: number,
  numberOfDays: number,
  taxRate: number = 0.16 // 16% VAT in Kenya
): {
  subtotal: number;
  tax: number;
  totalAmount: number;
} {
  const subtotal = pricePerDay * numberOfDays;
  const tax = subtotal * taxRate;
  const totalAmount = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function calculateTaxiPrice(
  basePrice: number,
  pricePerKm: number,
  distance: number,
  taxRate: number = 0.16
): {
  calculatedPrice: number;
  tax: number;
  totalAmount: number;
} {
  const calculatedPrice = basePrice + pricePerKm * distance;
  const tax = calculatedPrice * taxRate;
  const totalAmount = calculatedPrice + tax;

  return {
    calculatedPrice: Math.round(calculatedPrice * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
