import { supabase } from "../../lib/supabase";


export interface InventoryTransaction {

  id:string;

  type:string;

  quantity:number;

  date:string;

  invoice?:string | null;

  reason?:string | null;

}





function mapTransactions(

  stockIn:any[] = [],

  stockOut:any[] = [],

  adjustments:any[] = []

):InventoryTransaction[]{



const history:InventoryTransaction[] = [



...stockIn.map(item=>({

id:item.id,

type:"STOCK IN",

quantity:Number(item.quantity || 0),

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...stockOut.map(item=>({

id:item.id,

type:"STOCK OUT",

quantity:Number(item.quantity || 0),

date:item.entry_date,

invoice:item.invoice_number ?? null

})),





...adjustments.map(item=>({

id:item.id,

type:

item.adjustment_type === "ADD"

?

"ADJUSTMENT ADD"

:

"ADJUSTMENT REMOVE",

quantity:Number(item.quantity || 0),

date:item.created_at,

reason:item.reason ?? null

}))



];



return history.sort(

(a,b)=>

new Date(b.date).getTime()

-

new Date(a.date).getTime()

);



}





export const StockHistoryService = {





async getProductHistory(

productId:string

):Promise<InventoryTransaction[]> {



const [

stockInResponse,

stockOutResponse,

adjustmentResponse

] = await Promise.all([



supabase

.from("stock_entries")

.select("*")

.eq(

"product_id",

productId

),




supabase

.from("stock_out_entries")

.select("*")

.eq(

"product_id",

productId

),




supabase

.from("stock_adjustments")

.select("*")

.eq(

"product_id",

productId

)



]);





if(stockInResponse.error)

throw stockInResponse.error;



if(stockOutResponse.error)

throw stockOutResponse.error;



if(adjustmentResponse.error)

throw adjustmentResponse.error;






return mapTransactions(

stockInResponse.data ?? [],

stockOutResponse.data ?? [],

adjustmentResponse.data ?? []

);



},







async getAllTransactions(

businessId:string

):Promise<InventoryTransaction[]> {



const [

stockInResponse,

stockOutResponse,

adjustmentResponse

] = await Promise.all([



supabase

.from("stock_entries")

.select("*")

.eq(

"business_id",

businessId

),




supabase

.from("stock_out_entries")

.select("*")

.eq(

"business_id",

businessId

),




supabase

.from("stock_adjustments")

.select("*")

.eq(

"business_id",

businessId

)



]);






if(stockInResponse.error)

throw stockInResponse.error;



if(stockOutResponse.error)

throw stockOutResponse.error;



if(adjustmentResponse.error)

throw adjustmentResponse.error;






return mapTransactions(

stockInResponse.data ?? [],

stockOutResponse.data ?? [],

adjustmentResponse.data ?? []

);



}





};