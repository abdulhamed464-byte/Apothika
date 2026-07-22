import { supabase } from "../../lib/supabase";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../../types/auth";

class AuthService {
  /**
   * Register a new user with Supabase Authentication.
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
        user: null,
      };
    }

    return {
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      user: authData.user,
    };
  }

  /**
   * Login an existing user.
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const { data: authData, error } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (error) {
      return {
        success: false,
        message: error.message,
        user: null,
      };
    }

    return {
      success: true,
      message: "Login successful.",
      user: authData.user,
    };
  }

  /**
   * Logout the current user.
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}

export default new AuthService();