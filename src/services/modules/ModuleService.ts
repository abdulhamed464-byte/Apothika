import { supabase } from "../../lib/supabase";

export const ModuleService = {

  async getWorkspaceModules(workspaceId: string) {

    const {
      data,
      error,
    } = await supabase
      .from("workspace_modules")
      .select("module_id")
      .eq("workspace_id", workspaceId)
      .eq("enabled", true);

    console.log("WORKSPACE MODULE IDS:", data);

    if (error) {
      console.error("workspace_modules error:", error);
      throw error;
    }

    const moduleIds = (data ?? []).map((m: any) => m.module_id);

    console.log("MODULE IDS ARRAY:", moduleIds);

    const result = await supabase
      .from("modules")
      .select("*")
      .in("id", moduleIds);

    console.log("MODULE QUERY RESULT:", result);

    if (result.error) {
      console.error("modules query error:", result.error);
      throw result.error;
    }

    return result.data ?? [];
  },

};