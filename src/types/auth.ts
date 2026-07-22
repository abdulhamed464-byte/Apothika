import type { User } from "@supabase/supabase-js";

/**
 * Registration request sent from the Register page.
 */
export interface RegisterRequest {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  currency: string;
  password: string;
}

/**
 * Login request.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Standard response returned by AuthService.
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
}