export interface InventoryBatch {

  id?: string;

  business_id: string;

  product_id: string;

  stock_entry_id?: number | null;

  batch_number: string;

  manufacturing_date?: string | null;

  expiry_date?: string | null;

  quantity_received: number;

  quantity_available: number;

  purchase_price: number;

  status: "ACTIVE" | "DEPLETED" | "EXPIRED" | "ARCHIVED";

  created_at?: string;

  updated_at?: string;

}

export interface BatchCreatePayload {

  business_id: string;

  product_id: string;

  stock_entry_id?: number;

  batch_number: string;

  manufacturing_date?: string;

  expiry_date?: string;

  quantity_received: number;

  purchase_price: number;

}