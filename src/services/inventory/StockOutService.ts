import { supabase } from "../../lib/supabase";
import type { StockOutPayload } from "../../types/stockOut";


export const StockOutService = {


  async createStockOut(
    payload: StockOutPayload
  ){

    const {
      data,
      error
    } = await supabase

      .from("stock_out_entries")

      .insert({

        business_id:
          payload.business_id,

        product_id:
          payload.product_id,

        quantity:
          payload.quantity,

        selling_price:
          payload.selling_price,

        customer_id:
          payload.customer_id ?? null,

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


    return data;

  }

};