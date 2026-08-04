export interface StockAdjustmentPayload {

  business_id:string;

  product_id:string;

  quantity:number;

  adjustment_type:
  "ADD" |
  "REMOVE";

  reason?:string;

}