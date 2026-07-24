export interface StockOutPayload {

  business_id: string;

  product_id: string;

  quantity: number;

  selling_price: number;

  customer_id?: string | null;

  invoice_number?: string | null;

  entry_date?: string;

}