import { supabase } from "../../lib/supabase";
import { AuthSession } from "../auth/AuthSession";


export const WorkspaceService = {


  async getUserWorkspace(){


    const user =
      await AuthSession.getCurrentUser();



    console.log(
      "WORKSPACE USER:",
      user
    );



    if(!user){

      console.error(
        "No logged in user"
      );

      return null;

    }




    const {
      data,
      error
    } = await supabase


      .from("user_workspaces")


      .select(
        "workspace_id,role"
      )


      .eq(
        "user_id",
        user.id
      )


      .single();





    if(error){


      console.error(
        "Workspace fetch failed:",
        error.message
      );


      return null;


    }





    console.log(
      "USER WORKSPACE:",
      data
    );




    return data;


  }


};