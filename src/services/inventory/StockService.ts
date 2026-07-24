import { supabase } from "../../lib/supabase";

import type {
  StockEntry,
  StockInPayload
} from "../../types/stock";


export const StockService = {


  async stockIn(
    payload: StockInPayload
  ): Promise<StockEntry> {


    const {
      data,
      error
    } = await supabase

      .from("stock_entries")

      .insert({

        business_id:
          payload.business_id,

        supplier_id:
          payload.supplier_id ?? null,

        product_id:
          payload.product_id,

        quantity:
          payload.quantity,

        purchase_price:
          payload.purchase_price,

        invoice_number:
          payload.invoice_number ?? null,

        entry_date:
          payload.entry_date ??
          new Date()
            .toISOString()
            .split("T")[0]

      })

      .select()

      .single();



    if(error){

      throw error;

    }


    return data as StockEntry;

  },







  async getAllStockEntries(

    businessId:string

  ):Promise<StockEntry[]> {


    const {

      data,

      error

    } = await supabase


      .from("stock_entries")

      .select("*")


      .eq(

        "business_id",

        businessId

      )


      .order(

        "created_at",

        {

          ascending:false

        }

      );



    if(error){

      throw error;

    }


    return (

      data ??

      []

    ) as StockEntry[];

  }





};