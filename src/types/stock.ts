export interface StockEntry {

  id?: number;

  created_at?: string;

  business_id: string;

  supplier_id?: string | null;

  product_id: string;

  quantity: number;

  purchase_price: number;

  invoice_number?: string | null;

  entry_date: string;

}





export interface StockSummary {

  product_id: string;

  quantity: number;

}





export interface StockInPayload {

  business_id: string;

  supplier_id?: string | null;

  product_id: string;

  quantity: number;

  purchase_price: number;

  invoice_number?: string | null;

  entry_date?: string;


  // Batch Information

  batch_number?: string;

  manufacturing_date?: string;

  expiry_date?: string;

}