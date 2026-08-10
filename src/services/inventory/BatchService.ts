import { supabase } from "../../lib/supabase";

import type {
  InventoryBatch,
  BatchCreatePayload
} from "../../types/batch";

export const BatchService = {

  async createBatch(
    payload: BatchCreatePayload
  ): Promise<InventoryBatch> {

    const {
      data,
      error
    } = await supabase
      .from("inventory_batches")
      .insert({

        business_id:
          payload.business_id,

        product_id:
          payload.product_id,

        stock_entry_id:
          payload.stock_entry_id ?? null,

        batch_number:
          payload.batch_number,

        manufacturing_date:
          payload.manufacturing_date ?? null,

        expiry_date:
          payload.expiry_date ?? null,

        quantity_received:
          payload.quantity_received,

        quantity_available:
          payload.quantity_received,

        purchase_price:
          payload.purchase_price,

        status:
          "ACTIVE"

      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as InventoryBatch;
  },


  async getProductBatches(
    productId: string
  ): Promise<InventoryBatch[]> {

    const {
      data,
      error
    } = await supabase
      .from("inventory_batches")
      .select("*")
      .eq(
        "product_id",
        productId
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {
      throw error;
    }

    return (
      data ?? []
    ) as InventoryBatch[];
  },


  async getBatchById(
    batchId: string
  ): Promise<InventoryBatch> {

    const {
      data,
      error
    } = await supabase
      .from("inventory_batches")
      .select("*")
      .eq(
        "id",
        batchId
      )
      .single();

    if (error) {
      throw error;
    }

    return data as InventoryBatch;
  },


  async updateAvailableQuantity(
    batchId: string,
    quantity: number
  ) {

    const {
      data,
      error
    } = await supabase
      .from("inventory_batches")
      .update({

        quantity_available:
          quantity

      })
      .eq(
        "id",
        batchId
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as InventoryBatch;
  },


  async getAvailableBatches(
    productId: string
  ): Promise<InventoryBatch[]> {

    const {
      data,
      error
    } = await supabase
      .from("inventory_batches")
      .select("*")
      .eq(
        "product_id",
        productId
      )
      .eq(
        "status",
        "ACTIVE"
      )
      .gt(
        "quantity_available",
        0
      )
      .order(
        "expiry_date",
        {
          ascending: true,
          nullsFirst: false
        }
      )
      .order(
        "created_at",
        {
          ascending: true
        }
      );

    if (error) {
      throw error;
    }

    return (
      data ?? []
    ) as InventoryBatch[];
  },


  isExpired(
    batch: InventoryBatch
  ): boolean {

    if (!batch.expiry_date) {
      return false;
    }

    return (
      new Date(batch.expiry_date)
      <
      new Date()
    );
  },


  isExpiringSoon(
    batch: InventoryBatch,
    days: number = 30
  ): boolean {

    if (!batch.expiry_date) {
      return false;
    }

    const difference =
      new Date(batch.expiry_date).getTime()
      -
      new Date().getTime();

    const daysRemaining =
      difference /
      (
        1000 *
        60 *
        60 *
        24
      );

    return (
      daysRemaining > 0
      &&
      daysRemaining <= days
    );
  }

};