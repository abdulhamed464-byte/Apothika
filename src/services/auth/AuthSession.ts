import { supabase } from "../../lib/supabase";


export const AuthSession = {


  async getCurrentUser() {


    const {
      data,
      error
    } = await supabase.auth.getUser();



    if(error){

      console.error(
        "No logged in user:",
        error.message
      );

      return null;

    }



    console.log(
      "LOGGED USER:",
      data.user
    );


    return data.user;


  }


};