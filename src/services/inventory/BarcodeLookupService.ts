import { supabase } from "../../lib/supabase";

import type { InventoryProduct } from "./ProductService";



export const BarcodeLookupService = {



  async findByBarcode(

    workspaceId:string,

    barcode:string

  ):Promise<InventoryProduct | null>{



    if(!barcode.trim()){


      return null;


    }






    const {data,error}=


      await supabase

      .from("products")

      .select(`

        *,

        stock_entries(

          quantity

        )

      `)

      .eq(

        "workspace_id",

        workspaceId

      )

      .eq(

        "barcode",

        barcode

      )

      .maybeSingle();







    if(error){


      throw error;


    }







    return data as InventoryProduct | null;


  }

};
