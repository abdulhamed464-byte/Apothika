import { supabase } from "../../lib/supabase";

import type { StockOutPayload } from "../../types/stockOut";

export const StockOutService = {

  async createStockOut(
    payload: StockOutPayload
  ) {

    const { data, error } = await supabase.rpc(
      "create_stock_out_transaction",
      {
        p_business_id: payload.business_id,
        p_product_id: payload.product_id,
        p_quantity: payload.quantity,
        p_selling_price: payload.selling_price,
        p_customer_id: payload.customer_id ?? null,
        p_invoice_number:
          payload.invoice_number ?? null,
        p_entry_date:
          payload.entry_date ??
          new Date()
            .toISOString()
            .split("T")[0]
      }
    );

    if (error) {
      throw error;
    }

    return data;
  }

};