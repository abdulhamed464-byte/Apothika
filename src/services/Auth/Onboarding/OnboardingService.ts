import { supabase } from "../../../lib/supabase";


export interface OnboardingData {
  businessName: string;
  country: string;
  currency: string;
  phone: string;
  email: string;
  industryId: string;
}


export interface OnboardingResponse {
  workspace_id: string;
}


export const OnboardingService = {

  async createWorkspace(
    userId: string,
    data: OnboardingData
  ): Promise<OnboardingResponse> {

    const { data: result, error } =
      await supabase.rpc(
        "create_workspace_onboarding",
        {
          p_user_id: userId,
          p_business_name: data.businessName,
          p_country: data.country,
          p_currency: data.currency,
          p_phone: data.phone,
          p_email: data.email,
          p_industry_id: data.industryId,
        }
      );


    if (error) {

      console.error(
        "Onboarding failed:",
        error
      );

      throw error;
    }


    return {
      workspace_id: result,
    };

  },

};