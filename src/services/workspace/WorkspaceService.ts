import { supabase } from "../../lib/supabase";
import { AuthSession } from "../auth/AuthSession";

export const WorkspaceService = {
async getUserWorkspace(): Promise<{
workspace_id: string;
role: string;
} | null> {
const user = await AuthSession.getCurrentUser();

console.log("WORKSPACE USER:", user);

if (!user) {
  console.error("No logged in user");
  return null;
}

const { data, error } = await supabase
  .from("user_workspaces")
  .select("workspace_id,role")
  .eq("user_id", user.id)
  .single();

if (error) {
  console.error("Workspace fetch failed:", error.message);
  return null;
}

console.log("USER WORKSPACE:", data);

return data;

},

async getBusinessId(): Promise<string | null> {
const workspace = await WorkspaceService.getUserWorkspace();

if (!workspace) {
  return null;
}

const { data, error } = await supabase
  .from("businesses")
  .select("id")
  .eq("workspace_id", workspace.workspace_id)
  .single();

if (error) {
  console.error("Business fetch failed:", error.message);
  return null;
}

return data?.id ?? null;

}
};
